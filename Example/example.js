import makeWASocket from '../lib/index.js'
import { useMultiFileAuthState } from '../lib/Utils/use-multi-file-auth-state.js'
import { stylishLog } from '../lib/Utils/stylish-terminal.js'
import { 
    sendInteractiveMessage,
    createQuickReplyButton,
    createUrlButton,
    createCallButton,
    createCopyButton
} from '../lib/Utils/buttons.js'

async function connectToWhatsApp() {
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
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401 // 401 is logged out
            
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
            
            // Skip messages from ourselves
            if (msg.key.fromMe) continue
            
            // Extract message content
            const messageContent = msg.message?.conversation || 
                                 msg.message?.extendedTextMessage?.text ||
                                 '[Media message]'
            
            // Log incoming message with stylish formatting
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
                
                // Check if message contains button-related commands
                if (messageContent.toLowerCase().includes('menu') || messageContent.toLowerCase().includes('help')) {
                    // Send interactive buttons menu
                    await sendInteractiveMessage(sock, jid, {
                        text: 'Welcome to our bot! Please select an option:',
                        footer: 'Choose from the options below',
                        title: 'Bot Menu',
                        interactiveButtons: [
                            createQuickReplyButton('support', 'Contact Support'),
                            createUrlButton('Documentation', 'https://example.com'),
                            createCallButton('Call Support', '+1234567890'),
                            createCopyButton('Copy Code', 'SUPPORT123')
                        ]
                    })
                } else if (messageContent.toLowerCase().includes('button')) {
                    // Send simple quick reply buttons
                    const { sendButtons } = await import('../lib/Utils/buttons.js')
                    await sendButtons(sock, jid, {
                        text: 'Choose an option:',
                        footer: 'Powered by Baileys buttons',
                        buttons: [
                            { id: 'opt1', text: 'Option 1' },
                            { id: 'opt2', text: 'Option 2' },
                            { id: 'opt3', text: 'Option 3' }
                        ]
                    })
                } else {
                    // Send the echo reply
                    await sock.sendMessage(jid, {
                        text: `🤖 Echo: ${messageContent}`
                    })
                }
                
                stylishLog.success(`Replied to ${jid}`)
            } catch (error) {
                stylishLog.error(`Failed to send message: ${error.message}`)
            }
        }
    })

    // Handle button responses
    sock.ev.on('messages.upsert', async (event) => {
        for (const msg of event.messages) {
            if (!msg.message) continue
            
            // Check for button responses
            if (msg.message?.buttonsResponseMessage) {
                const selectedButtonId = msg.message.buttonsResponseMessage.selectedButtonId
                const jid = msg.key.remoteJid
                stylishLog.info(`Button selected: ${selectedButtonId} from ${jid}`)
                
                // Handle different button responses
                let responseText = ''
                switch(selectedButtonId) {
                    case 'support':
                        responseText = 'You selected to contact support. Please wait while we connect you.'
                        break
                    case 'opt1':
                        responseText = 'You selected Option 1! Great choice.'
                        break
                    case 'opt2':
                        responseText = 'You selected Option 2! Good pick.'
                        break
                    case 'opt3':
                        responseText = 'You selected Option 3! Excellent!'
                        break
                    default:
                        responseText = `Thank you for selecting: ${selectedButtonId}`
                }
                
                if (responseText) {
                    await sock.sendMessage(jid, { text: responseText })
                }
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