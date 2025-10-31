<div align="center">
  <img src="https://raw.githubusercontent.com/WhiskeySockets/Baileys/refs/heads/master/Media/logo.png" width="200" height="200" alt="Baileys Logo">
  <h1>Baileys - Advanced WhatsApp Multi-Device API</h1>
  <p>A lightweight, efficient, and secure WhatsApp API library for Node.js</p>
</div>

<div align="center">
  
  [![NPM](https://nodei.co/npm/Baileys.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/Baileys/)
  
  [![npm version](https://badge.fury.io/js/Baileys.svg)](https://badge.fury.io/js/Baileys)
  [![Downloads](https://img.shields.io/npm/dm/Baileys.svg)](https://www.npmjs.com/package/Baileys)
  [![License](https://img.shields.io/npm/l/Baileys.svg)](https://github.com/BF667/Baileys/blob/main/LICENSE)
  [![GitHub stars](https://img.shields.io/github/stars/BF667/Baileys)](https://github.com/BF667/Baileys)
  [![GitHub issues](https://img.shields.io/github/issues/BF667/Baileys)](https://github.com/BF667/Baileys/issues)

</div>

## 📖 Table of Contents

- [🌟 Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📚 API Documentation](#-api-documentation)
- [🔧 Configuration Options](#-configuration-options)
- [🎓 Tutorials](#-tutorials)
- [🛡️ Security Features](#️-security-features)
- [⚡ Performance Optimizations](#️-performance-optimizations)
- [🧪 Testing](#-testing)
- [🔍 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)
- [📄 License](#-license)
- [👨‍💻 Authors](#-authors)
- [🙏 Acknowledgments](#-acknowledgments)

## 🌟 Features

- ✅ **Multi-device Support** - Modern WhatsApp Web API
- 🔐 **Secure Authentication** - Advanced cryptographic protocols
- ⚡ **High Performance** - Optimized for speed and efficiency
- 🛡️ **Enhanced Security** - Input validation and sanitization
- 📊 **Comprehensive Logging** - Detailed debugging capabilities
- 🔄 **Auto-reconnection** - Robust connection management
- 📱 **Rich Media Support** - Handle images, videos, documents, GIFs
- 💬 **Message Management** - Full chat interaction capabilities
- 🤖 **Bot Framework Ready** - Easy to build WhatsApp bots
- 📢 **Channel Support** - Send messages to WhatsApp Channels
- 🖱️ **Interactive Messages** - Create buttons and quick replies
- 🖼️ **Album Messaging** - Send grouped media as albums
- 👤 **LID Grouping** - Handle latest @lid addressing style
- 🤖 **AI Message Style** - Add stylized "AI" icon to messages
- 📷 **HD Profile Pics** - Upload full-size profile pictures
- 🔐 **Custom Pairing Codes** - Generate alphanumeric pairing codes
- 📊 **Poll Support** - Create and manage interactive polls
- 📍 **Location Sharing** - Send and receive location information
- 🏷️ **Mention Support** - Mention users in group messages
- 🎨 **Extended Media** - Send stickers, documents, audio messages
- 🔄 **Message Updates** - Real-time message status updates
- 👥 **Contact Management** - Manage contacts and profiles
- 📁 **Media Processing** - Automatic compression and format conversion

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- A WhatsApp account
- A computer to scan QR code (for first-time setup)

### Installation
```bash
npm install Baileys
```

### Basic Usage
```javascript
import { makeWASocket, DisconnectReason } from 'Baileys'
import { Boom } from '@hapi/boom'

async function connectToWhatsApp() {
  const socket = makeWASocket({
    printQRInTerminal: true,
    browser: ['Baileys', 'Chrome', '1.0.0'] // User agent
  })
  
  socket.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if(connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
      // reconnect if not logged out
      if(shouldReconnect) {
        connectToWhatsApp()
      }
    } else if(connection === 'open') {
      console.log('opened connection')
    }
  })
  
  // Send a message
  await socket.sendMessage('1234567890@s.whatsapp.net', { text: 'Hello there!' })
}

connectToWhatsApp()
```

## 📚 API Documentation

### Core Functions

#### `makeWASocket(config)`

Creates a new WhatsApp socket connection with the specified configuration.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `SocketConfig` | Configuration object for the connection |

**Config Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `waWebSocketUrl` | `string` | - | WebSocket URL to connect to WhatsApp |
| `connectTimeoutMs` | `number` | 60_000 | Connection timeout in milliseconds |
| `defaultQueryTimeoutMs` | `number` | 60_000 | Default timeout for queries |
| `keepAliveIntervalMs` | `number` | 30_000 | Ping-pong interval for WebSocket |
| `logger` | `Logger` | - | Logger instance |
| `browser` | `[string, string, string]` | `['Baileys', 'Chrome', '1.0.0']` | Browser description |
| `auth` | `AuthenticationState` | - | Authentication state |
| `printQRInTerminal` | `boolean` | `false` | Whether to print QR code in terminal |
| `makeSignalRepository` | `Function` | - | Function to create signal repository |
| `generateHighQualityLinkPreview` | `boolean` | `false` | Generate high quality link previews |
| `syncFullHistory` | `boolean` | `false` | Whether to sync full chat history |
| `getMessage` | `Function` | - | Function to retrieve messages by ID |
| `patchChatUserJid` | `Function` | - | Function to patch chat user JIDs |
| `options` | `Object` | - | Additional WebSocket options |
| `reconnectDelayMs` | `number` | 4000 | Delay between reconnection attempts |
| `maxMsgRetryCount` | `number` | 5 | Maximum message retry attempts |
| `emitOwnEvents` | `boolean` | `true` | Emit own events |
| `fireInitQueries` | `boolean` | `true` | Execute initialization queries |
| `markOnlineOnConnect` | `boolean` | `true` | Mark as online when connected |
| `msgRetryCounterCache` | `Object` | - | Cache for message retry counter |
| `blockQueryOnProcess` | `boolean` | `true` | Block query when processing |

### Events

#### Connection Events

- `connection.update` - Connection state changes
  - `connection`: current connection state (`'connecting'`, `'open'`, `'close'`)
  - `lastDisconnect`: reason for disconnection
  - `qr`: QR code string when waiting for scan

- `creds.update` - Credentials update
  - Called when authentication credentials are updated
  - Store these credentials to maintain session

- `messages.upsert` - New messages received
  - `messages`: array of new messages
  - `type`: type of message event

- `messages.update` - Message updates (e.g., read receipts)

- `presence.update` - Contact presence updates (online/offline)

- `chats.set` - Initial chat list loaded

- `chats.upsert` - New chats added

- `chats.update` - Chat updates (e.g., name change, unread count)

- `contacts.set` - Initial contact list loaded

- `contacts.upsert` - New contacts added

- `groups.update` - Group information updates

## 🔧 Configuration Options

### Authentication State Management

```javascript
import { useMultiFileAuthState } from 'Baileys'

// Use file-based authentication state
const { state, saveCreds } = await useMultiFileAuthState('auth_info')

const socket = makeWASocket({
  auth: state,
  printQRInTerminal: true
})

// Save credentials automatically
socket.ev.on('creds.update', saveCreds)
```

### Database Integration for Auth State

```javascript
import { Buffer } from 'buffer'

// Custom authentication state using database
const useDatabaseAuthState = async () => {
  // Load auth credentials from database
  const databaseCredentials = await db.collection('auth').findOne({ id: 'primary' })

  return {
    state: {
      creds: databaseCredentials || {},
      keys: {
        get: (type, ids) => {
          // Fetch keys from database
          return ids.reduce((dict, id) => {
            const key = db.collection('keys').findOne({ id, type })
            dict[id] = key || null
            return dict
          }, {})
        },
        set: (data) => {
          // Save keys to database
          for (const [type, entries] of Object.entries(data)) {
            for (const [id, value] of Object.entries(entries)) {
              db.collection('keys').updateOne(
                { id, type },
                { $set: { value } },
                { upsert: true }
              )
            }
          }
        }
      }
    },
    saveCreds: async () => {
      // Save credentials to database
      await db.collection('auth').updateOne(
        { id: 'primary' },
        { $set: state.creds },
        { upsert: true }
      )
    }
  }
}
```

### Custom Logger

```javascript
import { Logger } from 'pino'

const logger = Logger({
  level: 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

const socket = makeWASocket({
  logger,
  // ... other options
})
```

### Advanced Connection Configuration

```javascript
const socket = makeWASocket({
  // Connection settings
  waWebSocketUrl: 'wss://web.whatsapp.com/ws', // WebSocket URL
  connectTimeoutMs: 60_000, // Connection timeout
  defaultQueryTimeoutMs: 60_000, // Query timeout
  keepAliveIntervalMs: 30_000, // Keep alive interval
  
  // Authentication
  auth: state,
  
  // Browser simulation
  browser: ['MyApp', 'Chrome', '20.0.04'],
  
  // Logging
  logger: logger,
  
  // Message handling
  getMessage: async key => {
    // Retrieve message from database/cache
    const msg = await db.messages.findOne({ id: key.id })
    return msg?.message
  },
  
  // Reconnection settings
  reconnectDelayMs: 4000,
  maxMsgRetryCount: 5,
  
  // Feature flags
  emitOwnEvents: true,
  fireInitQueries: true,
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  syncFullHistory: false
})
```

## 🎓 Tutorials

### Tutorial 1: Building a Basic WhatsApp Bot

This tutorial shows how to build a simple WhatsApp bot that responds to messages.

```javascript
import { makeWASocket, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, generateWAMessageFromContent, proto } from 'Baileys'
import { Boom } from '@hapi/boom'
import NodeCache from 'node-cache'
import readline from 'readline'

// Create a cache for signal keys
const msgRetryCounterCache = new NodeCache()

const usePairingCode = true

// Connect to WhatsApp
async function connectToWhatsApp() {
  // Fetch latest version of WhatsApp Web
  const { version, isLatest } = await fetchLatestBaileysVersion()
  console.log(`Using WhatsApp Web v${version.join('.')}, isLatest: ${isLatest}`)

  const socket = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !usePairingCode,
    browser: ['Chrome (Linux)', '', ''],
    auth: state,
    msgRetryCounterCache,
    generateHighQualityLinkPreview: true
  })

  // Handle connection updates
  socket.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update
    
    if (qr) {
      console.log('QR Code received, scan it to connect:', qr)
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
      
      if (shouldReconnect) {
        connectToWhatsApp()
      }
    } else if (connection === 'open') {
      console.log('Connected to WhatsApp!')
    }
  })

  // Handle credentials update
  socket.ev.on('creds.update', saveCreds)

  // Handle incoming messages
  socket.ev.on('messages.upsert', async ({ messages }) => {
    for (const message of messages) {
      if (!message.key.fromMe && message.message) {
        const text = message.message.conversation || 
                    (message.message.extendedTextMessage?.text) || 
                    ''
        
        console.log(`Received message from ${message.key.remoteJid}: ${text}`)
        
        // Simple echo bot
        if (text.toLowerCase() === 'hello') {
          await socket.sendMessage(message.key.remoteJid!, { 
            text: 'Hello! How can I help you?' 
          })
        } else if (text.toLowerCase() === 'help') {
          await socket.sendMessage(message.key.remoteJid!, { 
            text: 'I am a simple bot. Try sending "hello" or "time"' 
          })
        } else if (text.toLowerCase() === 'time') {
          const currentTime = new Date().toLocaleString()
          await socket.sendMessage(message.key.remoteJid!, { 
            text: `Current time: ${currentTime}` 
          })
        }
      }
    }
  })

  return socket
}

connectToWhatsApp()
```

### Tutorial 2: Sending Rich Media Messages

Learn how to send different types of media messages.

```javascript
import { makeWASocket } from 'Baileys'
import fs from 'fs'
import axios from 'axios'

async function sendRichMedia(socket) {
  const target = '1234567890@s.whatsapp.net' // Replace with actual number

  // Send image
  await socket.sendMessage(target, {
    image: { url: './assets/sample.jpg' },
    caption: 'Here is your image!'
  })

  // Send video
  await socket.sendMessage(target, {
    video: { url: './assets/sample.mp4' },
    caption: 'Check out this video!'
  })

  // Send document
  await socket.sendMessage(target, {
    document: { url: './assets/sample.pdf' },
    mimetype: 'application/pdf',
    fileName: 'sample.pdf'
  })

  // Send audio (voice message)
  await socket.sendMessage(target, {
    audio: { url: './assets/sample.mp3' },
    ptt: true // Push to talk (voice message)
  })

  // Send sticker
  await socket.sendMessage(target, {
    sticker: { url: './assets/sample.webp' }
  })
}
```

### Tutorial 3: Creating Interactive Messages with Buttons

Learn to create messages with interactive buttons.

```javascript
// Simple button message
const buttons = [
  { buttonId: 'weather', buttonText: { displayText: 'Weather' }, type: 1 },
  { buttonId: 'news', buttonText: { displayText: 'Latest News' }, type: 1 },
  { buttonId: 'help', buttonText: { displayText: 'Help' }, type: 1 }
]

const buttonMessage = {
  text: 'What would you like to know?',
  footer: 'Choose an option below',
  buttons: buttons,
  headerType: 1
}

await socket.sendMessage(target, buttonMessage)

// Button message with image header
const imageButtonMessage = {
  image: { url: './assets/header.jpg' },
  caption: 'Check out our new products!',
  footer: 'Select an option',
  buttons: [
    { buttonId: 'buy', buttonText: { displayText: 'Buy Now' }, type: 1 },
    { buttonId: 'more', buttonText: { displayText: 'Learn More' }, type: 1 }
  ],
  headerType: 4
}

await socket.sendMessage(target, imageButtonMessage)

// Button message with video header
const videoButtonMessage = {
  video: { url: './assets/demo.mp4' },
  caption: 'Watch our demo video!',
  footer: 'Select an option',
  buttons: [
    { buttonId: 'order', buttonText: { displayText: 'Order Now' }, type: 1 },
    { buttonId: 'contact', buttonText: { displayText: 'Contact Us' }, type: 1 }
  ],
  headerType: 5
}

await socket.sendMessage(target, videoButtonMessage)
```

### Tutorial 4: Working with Lists

Create interactive lists for better user experience.

```javascript
// Create a list message
const listMessage = {
  text: "Hello! Please select an option:",
  footer: "Powered by Baileys",
  title: "My App Menu",
  buttonText: "Select Option",
  sections: [
    {
      title: "Products",
      rows: [
        { 
          title: "Laptop", 
          description: "Gaming Laptop with RTX 4090", 
          rowId: "laptop" 
        },
        { 
          title: "Phone", 
          description: "Latest Smartphone", 
          rowId: "phone" 
        }
      ]
    },
    {
      title: "Services",
      rows: [
        { 
          title: "Support", 
          description: "24/7 Customer Support", 
          rowId: "support" 
        },
        { 
          title: "Delivery", 
          description: "Free Delivery Worldwide", 
          rowId: "delivery" 
        }
      ]
    }
  ]
}

await socket.sendMessage(target, listMessage)
```

### Tutorial 5: Creating Polls

Add interactive polls to your messages.

```javascript
// Create a simple poll
const simplePoll = {
  name: "What's your favorite programming language?",
  values: ["JavaScript", "Python", "Java", "C++"],
  selectableCount: 1 // Only allow one selection
}

await socket.sendMessage(target, { poll: simplePoll })

// Create a multiple selection poll
const multiPoll = {
  name: "Which features do you want?",
  values: ["Dark Mode", "Multi-language", "Offline Mode", "Custom Themes"],
  selectableCount: 0 // Allow multiple selections (-1 means unlimited)
}

await socket.sendMessage(target, { poll: multiPoll })
```

### Tutorial 6: Group Management

Manage WhatsApp groups programmatically.

```javascript
// Create a group
const group = await socket.groupCreate("My New Group", [
  "1234567890@s.whatsapp.net", 
  "9876543210@s.whatsapp.net"
])

console.log("Created group with ID:", group.id)

// Add participants to a group
await socket.groupAdd(group.id, [
  "5555555555@s.whatsapp.net",
  "6666666666@s.whatsapp.net"
])

// Remove participants from a group
await socket.groupRemove(group.id, [
  "6666666666@s.whatsapp.net"
])

// Update group subject
await socket.groupUpdateSubject(group.id, "Updated Group Name")

// Update group description
await socket.groupUpdateDescription(group.id, "Welcome to our awesome group!")

// Update group settings (only admins can send messages)
await socket.groupSettingUpdate(group.id, 'announcement') // Only allow admins to send messages

// Update group settings (everyone can send messages)
await socket.groupSettingUpdate(group.id, 'not_announcement') // Everyone can send messages

// Update group picture
await socket.updateProfilePicture(group.id, {
  url: './assets/group_picture.jpg'
})

// Get group invite code
const code = await socket.groupInviteCode(group.id)
console.log("Group invite link: https://chat.whatsapp.com/" + code)
```

### Tutorial 7: Newsletter and Channel Support

Work with WhatsApp Channels and Newsletters.

```javascript
// Create a newsletter
const newsletter = await socket.newsletterCreate("My Newsletter", {
  description: "Get daily updates from us",
  picture: './assets/newsletter.jpg'
})

console.log("Newsletter created with ID:", newsletter.id)

// Update newsletter description
await socket.newsletterUpdateDescription(newsletter.id, "Fresh updates weekly")

// Update newsletter picture
await socket.newsletterUpdatePicture(newsletter.id, {
  url: './assets/new_newsletter.jpg'
})

// Get newsletter info
const info = await socket.newsletterInfo(newsletter.id)
console.log("Newsletter info:", info)

// Send a message to a newsletter
await socket.sendMessage(newsletter.id, {
  text: "Hello subscribers! Here's your daily update."
})

// React to a newsletter message
await socket.newsletterReactMessage(newsletter.id, "messageId", "👍")
```

## 🛡️ Security Features

- **Input Validation**: All inputs are validated to prevent injection attacks
- **Connection Security**: Secure WebSocket connections with proper authentication
- **Data Sanitization**: Automatic sanitization of user inputs
- **Rate Limiting**: Built-in protection against excessive requests
- **Phone Number Validation**: Comprehensive phone number format checking
- **Cryptography**: State-of-the-art encryption using Signal Protocol
- **Session Management**: Secure session storage and management
- **Access Controls**: Fine-grained permissions for operations
- **Message Integrity**: Verification of message authenticity
- **Secure Defaults**: Safe configuration defaults out of the box

## ⚡ Performance Optimizations

- **Connection Pooling**: Efficient connection management
- **Caching**: Built-in caching for frequently accessed data
- **Memory Management**: Proper cleanup of event listeners
- **Asynchronous Operations**: Non-blocking operations for better performance
- **Pre-key Management**: Automated handling of cryptographic keys
- **Compression**: Efficient data compression for faster transfers
- **Lazy Loading**: Load resources only when needed
- **Batch Processing**: Group operations for efficiency
- **Resource Cleanup**: Automatic cleanup of unused resources
- **Optimized Queries**: Minimize network requests

## 🧪 Testing

### Running Tests
```bash
npm test
# or
npm run test
```

### Development Setup
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

## 🔍 Troubleshooting

### Common Issues

1. **Connection Problems**
   - Ensure your WhatsApp account is not banned
   - Check your network connection
   - Verify authentication credentials
   - Try changing the browser option in config
   - Use different WebSocket URL if needed

2. **QR Code Issues**
   - Update your WhatsApp Web in browser
   - Clear browser cache and cookies
   - Try different browsers
   - Ensure camera/lighting conditions are good for QR scan

3. **Authentication Failures**
   - Use fresh authentication credentials
   - Check for session expiration
   - Delete auth files and re-authenticate if needed
   - Ensure you're using latest library version

4. **Media Upload Problems**
   - Ensure media files are accessible
   - Check file size limits (max 16MB for images/videos)
   - Verify file formats are supported
   - Check file permissions

5. **Rate Limiting**
   - Avoid sending too many messages in a short time
   - Implement proper delays between message sends
   - Follow WhatsApp's terms of service

### Debugging
Enable trace logging to get detailed information:

```javascript
import { defaultLogger } from 'Baileys'
const logger = defaultLogger.child({ level: 'trace' })

const socket = makeWASocket({ 
  logger,
  // ... other options
})
```

### Common Error Solutions

**Error: "Connection closed"**
- Solution: Implement proper reconnection logic as shown in the quick start example

**Error: "Invalid session" or authentication issues**
- Solution: Delete the auth_info directory (or your auth state location) and reauthenticate

**Error: "Message not sent"**
- Solution: Verify the recipient's phone number format (should be in international format with country code)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines
- Follow the existing code style
- Write tests for new functionality
- Update documentation as needed
- Submit pull requests to the `main` branch

### Reporting Issues
- Check existing issues before creating a new one
- Provide detailed information about the issue
- Include your environment details (Node.js version, OS, etc.)
- Steps to reproduce the issue

## 📞 Support

For support and questions:
- Check the [FAQ](#faq) below
- Open an issue in the repository
- Join our community discussions
- Check the examples in the repository

### FAQ

**Q: Can I use this for commercial purposes?**  
A: Yes, this library is MIT licensed, allowing commercial use with proper attribution.

**Q: How do I handle multiple accounts?**  
A: Create separate instances with different auth states using `useMultiFileAuthState`.

**Q: Is this library compliant with WhatsApp's ToS?**  
A: This library implements WhatsApp's official protocols. Usage must comply with WhatsApp's Terms of Service.

**Q: How often should I update the library?**  
A: Regularly check for updates to maintain compatibility with WhatsApp's changing protocols.

**Q: Can I send messages to contacts who haven't messaged me first?**  
A: No, WhatsApp's policy requires that contacts must message you first before you can message them (except in groups).

**Q: What's the difference between Baileys and the original WhatsApp Business API?**  
A: Baileys is an unofficial implementation of WhatsApp Web protocols, while the official Business API is provided by WhatsApp.

**Q: How do I get the correct JID format for users and groups?**  
A: User JIDs are in the format `phonenumber@s.whatsapp.net`, group JIDs end in `@g.us`, and broadcast lists end in `@broadcast`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

**Original Author**: adiwajshing - [GitHub](https://github.com/adiwajshing)  
**Current Maintainers**: whiskeysockets - [GitHub](https://github.com/whiskeysockets)  
**Contributor**: BF667 - [GitHub](https://github.com/BF667)  

## 🙏 Acknowledgments

- Thanks to [adiwajshing](https://github.com/adiwajshing) for the original Baileys library
- Thanks to [whiskeysockets](https://github.com/whiskeysockets) for continued Baileys development
- The WhatsApp Web API community
- All contributors who help maintain and improve this library
- Users who provide feedback and help identify issues

---

<div align="center">

**Made with ❤️ for the WhatsApp Web API community**

[![Stargazers repo](https://reporoster.com/stars/BF667/Baileys)](https://github.com/BF667/Baileys/stargazers)

### 🚀 Ready to build amazing WhatsApp applications? Join our community of developers!

</div>