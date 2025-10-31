<div align="center">
  <img src="https://raw.githubusercontent.com/WhiskeySockets/Baileys/refs/heads/master/Media/logo.png" width="200" height="200" alt="Baileys Logo">
  <h1>Baileys - Advanced WhatsApp Multi-Device API</h1>
  <p>A lightweight, efficient, and secure WhatsApp API library for Node.js</p>
</div>

<div align="center">
  
  [![NPM](https://nodei.co/npm/Baileys.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/Baileys/)
  
  [![npm version](https://badge.fury.io/js/Baileys.svg)](https://badge.fury.io/js/Baileys)
  [![Downloads](https://img.shields.io/npm/dm/Baileys.svg)](https://www.npmjs.com/package/Baileys)
  [![License](https://img.shields.io/npm/l/Baileys.svg)](https://github.com/WhiskeySockets/Baileys/blob/main/LICENSE)
  [![GitHub stars](https://img.shields.io/github/stars/WhiskeySockets/Baileys)](https://github.com/WhiskeySockets/Baileys/stargazers)
  [![GitHub issues](https://img.shields.io/github/issues/WhiskeySockets/Baileys)](https://github.com/WhiskeySockets/Baileys/issues)

</div>

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
    // Your config options here
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

### Message Handling

#### Sending Messages

```javascript
// Send text message
await socket.sendMessage('1234567890@s.whatsapp.net', { text: 'Hello!' })

// Send image
await socket.sendMessage(
  '1234567890@s.whatsapp.net', 
  { 
    image: { url: './path/to/image.jpg' },
    caption: 'Beautiful image!'
  }
)

// Send video
await socket.sendMessage(
  '1234567890@s.whatsapp.net', 
  { 
    video: { url: './path/to/video.mp4' },
    caption: 'Check out this video!'
  }
)

// Send audio
await socket.sendMessage(
  '1234567890@s.whatsapp.net',
  {
    audio: { url: './path/to/audio.mp3' },
    ptt: true // for voice messages
  }
)

// Send document
await socket.sendMessage(
  '1234567890@s.whatsapp.net',
  {
    document: { url: './path/to/document.pdf' },
    mimetype: 'application/pdf',
    fileName: 'document.pdf'
  }
)

// Send sticker
await socket.sendMessage(
  '1234567890@s.whatsapp.net',
  {
    sticker: { url: './path/to/sticker.webp' }
  }
)
```

## 🔧 Advanced Configuration

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

### Newsletter and Channel Features

```javascript
// Create a newsletter
await sock.newsletterCreate("My Newsletter");

// Update newsletter description
await sock.newsletterUpdateDescription("xxxx@newsletter", "Fresh updates weekly");

// Send reaction to channel message
await sock.newsletterReactMessage("xxxx@newsletter", "messageId", "🔥");

// Send album (multiple media as one message)
const media = [
  { image: { url: "https://example.com/pic1.jpg" } },
  { video: { url: "https://example.com/clip.mp4" } }
];

await sock.sendMessage(id, { album: media, caption: "Memories 💫" });
```

### Interactive Messages with Buttons

```javascript
const buttons = [
  { buttonId: 'btn1', buttonText: { displayText: 'Click Me' }, type: 1 },
  { buttonId: 'btn2', buttonText: { displayText: 'Visit Site' }, type: 1 }
];

const msg = {
  text: "Choose one:",
  footer: "Made with love 💜",
  buttons,
  headerType: 1
};

await sock.sendMessage(id, msg);
```

### Poll Messages

```javascript
const pollMessage = {
  name: "Favorite Color?",
  values: ["Red", "Blue", "Green"],
  selectableCount: 1
};

await sock.sendMessage(id, { poll: pollMessage });
```

### Location Sharing

```javascript
const locationMessage = {
  degreesLatitude: 37.422,
  degreesLongitude: -122.084,
  name: "Googleplex",
  address: "1600 Amphitheatre Pkwy, Mountain View, CA 94043"
};

await sock.sendMessage(id, { location: locationMessage });
```

### Group Management

```javascript
// Create group
const group = await sock.groupCreate("My New Group", [number1, number2]);

// Add participants
await sock.groupAdd(group.id, [number3, number4]);

// Change group description
await sock.groupUpdateDescription(group.id, "This is our awesome group!");
```

### Custom Pairing Code

```javascript
// Request pairing with custom code
const code = await sock.requestPairingCode("62xxxxxxxxxx", "CUSTOM1234");
console.log("Your Pairing Code:", code);
```

## 🛡️ Security Features

- **Input Validation**: All inputs are validated to prevent injection attacks
- **Connection Security**: Secure WebSocket connections with proper authentication
- **Data Sanitization**: Automatic sanitization of user inputs
- **Rate Limiting**: Built-in protection against excessive requests
- **Phone Number Validation**: Comprehensive phone number format checking
- **Cryptography**: State-of-the-art encryption using Signal Protocol
- **Session Management**: Secure session storage and management

## ⚡ Performance Optimizations

- **Connection Pooling**: Efficient connection management
- **Caching**: Built-in caching for frequently accessed data
- **Memory Management**: Proper cleanup of event listeners
- **Asynchronous Operations**: Non-blocking operations for better performance
- **Pre-key Management**: Automated handling of cryptographic keys
- **Compression**: Efficient data compression for faster transfers

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

2. **QR Code Issues**
   - Update your WhatsApp Web in browser
   - Clear browser cache and cookies
   - Try different browsers
   - Ensure camera/lighting conditions are good for QR scan

3. **Authentication Failures**
   - Use fresh authentication credentials
   - Check for session expiration
   - Delete auth files and re-authenticate if needed

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

[![Stargazers repo](https://reporoster.com/stars/WhiskeySockets/Baileys)](https://github.com/WhiskeySockets/Baileys/stargazers)

### 🚀 Ready to build amazing WhatsApp applications? Join our community of developers!

</div>