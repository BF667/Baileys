const WAProto = require('../../WAProto').proto;
const crypto = require('crypto');
const Utils_1 = require("../Utils");

class RexxHayanasi {
    constructor(utils, waUploadToServer, relayMessageFn) {
        this.utils = utils;
        this.relayMessage = relayMessageFn;
        this.waUploadToServer = waUploadToServer;
        
        this.bail = {
            generateWAMessageContent: this.utils.generateWAMessageContent || Utils_1.generateWAMessageContent,
            generateMessageID: Utils_1.generateMessageID,
            // FIXED: safer getContentType guard
            getContentType: (msg) => {
                if (!msg || typeof msg !== 'object') return null;
                const m = msg.message || {};
                if (typeof m !== 'object') return null;
                return Object.keys(m)[0] || null;
            }
        };
    }

    detectType(content) {
        if (content.requestPaymentMessage) return 'PAYMENT';
        if (content.productMessage) return 'PRODUCT';
        if (content.interactiveMessage) return 'INTERACTIVE';
        if (content.albumMessage) return 'ALBUM';
        if (content.eventMessage) return 'EVENT';
        if (content.pollResultMessage) return 'POLL_RESULT';
        if (content.groupStatusMessage) return 'GROUP_STORY';
        return null;
    }

    async handlePayment(content, quoted) {
        // FIXED: Guard & error handling
        const data = content?.requestPaymentMessage;
        if (!data) throw new Error('Missing requestPaymentMessage in content');

        try {
            let notes = {};

            if (data.sticker?.stickerMessage) {
                notes = {
                    stickerMessage: {
                        ...data.sticker.stickerMessage,
                        contextInfo: {
                            stanzaId: quoted?.key?.id,
                            participant: quoted?.key?.participant || content.sender,
                            quotedMessage: quoted?.message
                        }
                    }
                };
            } else if (data.note) {
                notes = {
                    extendedTextMessage: {
                        text: data.note,
                        contextInfo: {
                            stanzaId: quoted?.key?.id,
                            participant: quoted?.key?.participant || content.sender,
                            quotedMessage: quoted?.message
                        }
                    }
                };
            }

            return {
                requestPaymentMessage: WAProto.Message.RequestPaymentMessage.fromObject({
                    expiryTimestamp: data.expiry || 0,
                    amount1000: data.amount || 0,
                    currencyCodeIso4217: data.currency || "IDR",
                    requestFrom: data.from || "0@s.whatsapp.net",
                    noteMessage: notes,
                    background: data.background ?? {
                        id: "DEFAULT",
                        placeholderArgb: 0xFFF0F0F0
                    }
                })
            };
        } catch (err) {
            console.error('handlePayment error:', err);
            throw err;
        }
    }
        
    async handleProduct(content, jid, quoted) {
        try {
            const {
                title = "", 
                description = "", 
                thumbnail,
                productId, 
                retailerId, 
                url, 
                body = "", 
                footer = "", 
                buttons = [],
                priceAmount1000 = null,
                currencyCode = "IDR"
            } = content.productMessage || {};

            let productImage = null;

            // FIXED: safer handling & fallback
            if (thumbnail) {
                try {
                    if (Buffer.isBuffer(thumbnail)) {
                        const res = await this.utils.generateWAMessageContent(
                            { image: thumbnail }, 
                            { upload: this.waUploadToServer }
                        );
                        productImage = res?.imageMessage || res?.message?.imageMessage || null;
                    } else if (typeof thumbnail === 'object' && thumbnail.url) {
                        const res = await this.utils.generateWAMessageContent(
                            { image: { url: thumbnail.url }}, 
                            { upload: this.waUploadToServer }
                        );
                        productImage = res?.imageMessage || res?.message?.imageMessage || null;
                    }
                } catch (err) {
                    console.warn('Thumbnail upload failed', err);
                }
            }

            const product = {
                productId,
                title,
                description,
                currencyCode,
                priceAmount1000,
                retailerId,
                url,
                productImageCount: productImage ? 1 : 0
            };

            if (productImage) product.productImage = productImage;

            return {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: { text: body },
                            footer: { text: footer },
                            header: {
                                title,
                                hasMediaAttachment: !!productImage,
                                productMessage: {
                                    product,
                                    businessOwnerJid: "0@s.whatsapp.net"
                                }
                            },
                            nativeFlowMessage: { buttons }
                        }
                    }
                }
            };
        } catch (err) {
            console.error('handleProduct error:', err);
            throw err;
        }
    }
    
    async handleInteractive(content, jid, quoted) {
        try {
            const {
                title,
                footer,
                thumbnail,
                image,
                video,
                document,
                mimetype,
                fileName,
                jpegThumbnail,
                contextInfo,
                externalAdReply,
                buttons = [],
                nativeFlowMessage,
                header
            } = content.interactiveMessage || {};

            let media = null;
            let mediaType = null;

            if (thumbnail) {
                media = await this.utils.prepareWAMessageMedia(
                    { image: { url: thumbnail } },
                    { upload: this.waUploadToServer }
                );
                mediaType = 'image';
            } else if (image) {
                if (typeof image === 'object' && image.url) {
                    media = await this.utils.prepareWAMessageMedia(
                        { image: { url: image.url } },
                        { upload: this.waUploadToServer }
                    );
                } else {
                    media = await this.utils.prepareWAMessageMedia(
                        { image },
                        { upload: this.waUploadToServer }
                    );
                }
                mediaType = 'image';
            } else if (video) {
                if (typeof video === 'object' && video.url) {
                    media = await this.utils.prepareWAMessageMedia(
                        { video: { url: video.url } },
                        { upload: this.waUploadToServer }
                    );
                } else {
                    media = await this.utils.prepareWAMessageMedia(
                        { video },
                        { upload: this.waUploadToServer }
                    );
                }
                mediaType = 'video';
            } else if (document) {
                let documentPayload = { document };
                if (jpegThumbnail) {
                    if (typeof jpegThumbnail === 'object' && jpegThumbnail.url) {
                        documentPayload.jpegThumbnail = { url: jpegThumbnail.url };
                    } else {
                        documentPayload.jpegThumbnail = jpegThumbnail;
                    }
                }
                media = await this.utils.prepareWAMessageMedia(
                    documentPayload,
                    { upload: this.waUploadToServer }
                );
                if (fileName) media.documentMessage.fileName = fileName;
                if (mimetype) media.documentMessage.mimetype = mimetype;
                mediaType = 'document';
            }

            let interactiveMessage = {
                body: { text: title || "" },
                footer: { text: footer || "" }
            };

            if (buttons && buttons.length > 0) {
                interactiveMessage.nativeFlowMessage = { buttons };
                if (nativeFlowMessage) {
                    interactiveMessage.nativeFlowMessage = {
                        ...interactiveMessage.nativeFlowMessage,
                        ...nativeFlowMessage
                    };
                }
            } else if (nativeFlowMessage) {
                interactiveMessage.nativeFlowMessage = nativeFlowMessage;
            }
            
            // FIXED: safer header spreading
            if (media) {
                const headerMedia = {};
                if (media.imageMessage) headerMedia.imageMessage = media.imageMessage;
                if (media.videoMessage) headerMedia.videoMessage = media.videoMessage;
                if (media.documentMessage) headerMedia.documentMessage = media.documentMessage;

                interactiveMessage.header = {
                    title: header || "",
                    hasMediaAttachment: true,
                    ...headerMedia
                };
            } else {
                interactiveMessage.header = {
                    title: header || "",        
                    hasMediaAttachment: false
                };
            }
            
            let finalContextInfo = {};
            if (contextInfo) {
                finalContextInfo = {
                    mentionedJid: contextInfo.mentionedJid || [],
                    forwardingScore: contextInfo.forwardingScore || 0,
                    isForwarded: contextInfo.isForwarded || false,
                    ...contextInfo
                };
            }
            
            if (externalAdReply) {
                finalContextInfo.externalAdReply = {
                    title: externalAdReply.title || "",
                    body: externalAdReply.body || "",
                    mediaType: externalAdReply.mediaType || 1,
                    thumbnailUrl: externalAdReply.thumbnailUrl || "",
                    mediaUrl: externalAdReply.mediaUrl || "",
                    sourceUrl: externalAdReply.sourceUrl || "",
                    showAdAttribution: externalAdReply.showAdAttribution || false,
                    renderLargerThumbnail: externalAdReply.renderLargerThumbnail || false,
                    ...externalAdReply
                };
            }
            
            if (Object.keys(finalContextInfo).length > 0) {
                interactiveMessage.contextInfo = finalContextInfo;
            }

            return { interactiveMessage };
        } catch (err) {
            console.error('handleInteractive error:', err);
            throw err;
        }
    }
    
    async handleAlbum(content, jid, quoted) {
        try {
            const array = Array.isArray(content.albumMessage) ? content.albumMessage : [];
            if (array.length === 0) throw new Error('albumMessage harus berupa array dengan isi media');

            const album = await this.utils.generateWAMessageFromContent(jid, {
                messageContextInfo: {
                    messageSecret: crypto.randomBytes(32),
                },
                albumMessage: {
                    expectedImageCount: array.filter(a => a.image).length,
                    expectedVideoCount: array.filter(a => a.video).length,
                },
            }, {
                userJid: this.utils.generateMessageID().split('@')[0] + '@s.whatsapp.net',
                quoted,
                upload: this.waUploadToServer
            });
            
            await this.relayMessage(jid, album.message, { messageId: album.key.id });
            
            for (let item of array) {
                const img = await this.utils.generateWAMessage(jid, item, {
                    upload: this.waUploadToServer,
                });
                
                img.message.messageContextInfo = {
                    messageSecret: crypto.randomBytes(32),
                    messageAssociation: {
                        associationType: 1,
                        parentMessageKey: album.key,
                    },    
                    participant: "0@s.whatsapp.net",
                    remoteJid: "status@broadcast",
                    forwardingScore: 99999,
                    isForwarded: true,
                    mentionedJid: [jid],
                    starred: true,
                    labels: ["Y", "Important"],
                    isHighlighted: true,
                    businessMessageForwardInfo: {
                        businessOwnerJid: jid,
                    },
                    dataSharingContext: {
                        showMmDisclosure: true,
                    },
                };

                img.message.forwardedNewsletterMessageInfo = {
                    newsletterJid: "0@newsletter",
                    serverMessageId: 1,
                    newsletterName: `WhatsApp`,
                    contentType: 1,
                    timestamp: new Date().toISOString(),
                    senderName: "kikyy dugonggg",
                    content: "Text Message",
                    priority: "high",
                    status: "sent",
                };
                
                img.message.disappearingMode = {
                    initiator: 3,
                    trigger: 4,
                    initiatorDeviceJid: jid,
                    initiatedByExternalService: true,
                    initiatedByUserDevice: true,
                    initiatedBySystem: true,
                    initiatedByServer: true,
                    initiatedByAdmin: true,
                    initiatedByUser: true,
                    initiatedByApp: true,
                    initiatedByBot: true,
                    initiatedByMe: true,
                };

                await this.relayMessage(jid, img.message, {
                    messageId: img.key.id,
                    quoted: {
                        key: {
                            remoteJid: album.key.remoteJid,
                            id: album.key.id,
                            fromMe: true,
                            participant: this.utils.generateMessageID().split('@')[0] + '@s.whatsapp.net',
                        },
                        message: album.message,
                    },
                });
            }
            return album;
        } catch (err) {
            console.error('handleAlbum error:', err);
            throw err;
        }
    }   

    async handleEvent(content, jid, quoted) {
        try {
            const eventData = content.eventMessage;
            if (!eventData) throw new Error('Missing eventMessage');

            const msg = await this.utils.generateWAMessageFromContent(jid, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2,
                            messageSecret: crypto.randomBytes(32),
                            supportPayload: JSON.stringify({
                                version: 2,
                                is_ai_message: true,
                                should_show_system_message: true,
                                ticket_id: crypto.randomBytes(16).toString('hex')
                            })
                        },
                        eventMessage: {
                            contextInfo: {
                                mentionedJid: [jid],
                                participant: jid,
                                remoteJid: "status@broadcast",
                                forwardedNewsletterMessageInfo: {
                                    newsletterName: "shenvn.",
                                    newsletterJid: "120363297591152843@newsletter",
                                    serverMessageId: 1
                                }
                            },
                            isCanceled: eventData.isCanceled || false,
                            name: eventData.name,
                            description: eventData.description,
                            location: eventData.location || {
                                degreesLatitude: 0,
                                degreesLongitude: 0,
                                name: "Location"
                            },
                            joinLink: eventData.joinLink || '',
                            startTime: typeof eventData.startTime === 'string' ? parseInt(eventData.startTime) : eventData.startTime || Date.now(),
                            endTime: typeof eventData.endTime === 'string' ? parseInt(eventData.endTime) : eventData.endTime || Date.now() + 3600000,
                            extraGuestsAllowed: eventData.extraGuestsAllowed !== false
                        }
                    }
                }
            }, { quoted });
            
            await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
            return msg;
        } catch (err) {
            console.error('handleEvent error:', err);
            throw err;
        }
    }
    
    async handlePollResult(content, jid, quoted) {
        try {
            const pollData = content.pollResultMessage;
            if (!pollData) throw new Error('Missing pollResultMessage');
        
            const msg = await this.utils.generateWAMessageFromContent(jid, {
                pollResultSnapshotMessage: {
                    name: pollData.name,
                    pollVotes: (pollData.pollVotes || []).map(vote => ({
                        optionName: vote.optionName,
                        optionVoteCount: typeof vote.optionVoteCount === 'number'
                            ? vote.optionVoteCount.toString()
                            : vote.optionVoteCount
                    }))
                }
            }, {
                userJid: this.utils.generateMessageID().split('@')[0] + '@s.whatsapp.net',
                quoted
            });
        
            await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
            return msg;
        } catch (err) {
            console.error('handlePollResult error:', err);
            throw err;
        }
    }

    async handleGroupStory(content, jid, quoted) {
        try {
            const storyData = content.groupStatusMessage;
            if (!storyData) throw new Error('Missing groupStatusMessage');

            let waMsgContent;
            if (storyData.message) {
                waMsgContent = storyData;
            } else {
                if (typeof this.bail?.generateWAMessageContent === "function") {
                    waMsgContent = await this.bail.generateWAMessageContent(storyData, {
                        upload: this.waUploadToServer
                    });
                } else if (typeof this.utils?.generateWAMessageContent === "function") {
                    waMsgContent = await this.utils.generateWAMessageContent(storyData, {
                        upload: this.waUploadToServer
                    });
                } else if (typeof this.utils?.prepareMessageContent === "function") {
                    waMsgContent = await this.utils.prepareMessageContent(storyData, {
                        upload: this.waUploadToServer
                    });
                } else {
                    waMsgContent = await Utils_1.generateWAMessageContent(storyData, {
                        upload: this.waUploadToServer
                    });
                }
            }

            let msg = {
                message: {
                    groupStatusMessageV2: {
                        message: waMsgContent.message || waMsgContent
                    }
                }
            };

            return await this.relayMessage(jid, msg.message, {
                messageId: this.bail.generateMessageID()
            });
        } catch (err) {
            console.error('handleGroupStory error:', err);
            throw err;
        }
    }
}

module.exports = RexxHayanasi;
