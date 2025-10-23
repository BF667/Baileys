import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '../lib/index.js'
import { Boom } from '@hapi/boom'
import { stylishLog } from '../lib/Utils/stylish-terminal.js'

async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    
    // Show stylish startup banner
    stylishLog.startup()

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: stylishLog.stylishLogger
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        
        // Log connection status with stylish formatting
        stylishLog.connection(connection)
        
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            
            if(shouldReconnect) {
                stylishLog.warn('Connection lost. Reconnecting...')
                setTimeout(connectToWhatsApp, 3000) // Wait 3 seconds before reconnecting
            } else {
                stylishLog.error('Device logged out. Please scan QR code again.')
            }
        } else if(connection === 'open') {
            stylishLog.success('Connected to WhatsApp successfully!')
        }
    })

    sock.ev.on('messages.upsert', async (event) => {
        for (const msg of event.messages) {
            if (!msg.message || !msg.key.remoteJid) continue
            
            const jid = msg.key.remoteJid
            const messageType = Object.keys(msg.message)[0]
            
            // Skip messages from ourselves
            if (msg.key.fromMe) continue
            
            // Log incoming message with stylish formatting
            const messageContent = msg.message?.conversation || 
                                 msg.message?.extendedTextMessage?.text ||
                                 `[${messageType.replace('Message', '')} message]`
            
            stylishLog.message(jid, messageContent)
            
            // Simple echo bot functionality
            try {
                // Send "typing" indicator
                await sock.sendPresenceUpdate('composing', jid)
                
                // Wait 1 second to simulate typing
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                // Send the echo reply
                await sock.sendMessage(jid, {
                    text: `🤖 Echo: ${messageContent}`
                })
                
                // Mark as read
                await sock.readMessages([msg.key])
                
                stylishLog.success(`Replied to ${jid}`)
            } catch (error) {
                stylishLog.error(`Failed to send message: ${error.message}`)
            }
        }
    })

    sock.ev.on('creds.update', saveCreds)
}

// Run the example
connectToWhatsApp().catch(error => {
    stylishLog.error(`Failed to start: ${error.message}`)
    console.error(error)
})