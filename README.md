<div align="center">
  <br>
  <img src="https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/Media/logo.png" alt="Baileys Logo" width="150">
  <h1>Baileys - Enhanced WhatsApp API Client</h1>
  <p>A comprehensive, TypeScript-based library for interacting with the WhatsApp Web API</p>
  

  [![License](https://img.shields.io/npm/l/baileys.svg?style=flat-square)](https://github.com/BF667/Baileys/blob/main/LICENSE)
  [![GitHub Issues](https://img.shields.io/github/issues/BF667/Baileys.svg?style=flat-square)](https://github.com/BF667/Baileys/issues)
</div>

## 🌟 Overview

Welcome to the enhanced Baileys library - a powerful, feature-rich fork of the popular WhatsApp Web API client. This version includes numerous improvements, additional features, and a stylish terminal interface to enhance your development experience.

### 🔧 Key Features

- ✅ **Enhanced Feature Set**: Extended capabilities beyond the standard Baileys implementation
- 🎨 **Stylish Terminal Interface**: Beautiful, colorful terminal output with gradients and animations
- 📱 **Multi-Device Support**: Full compatibility with WhatsApp's multi-device beta
- 🔒 **Secure Communication**: End-to-end encryption compliant with WhatsApp protocols
- ⚡ **Performance Optimized**: Efficient memory usage and faster message processing
- 🛠️ **Developer Friendly**: Comprehensive documentation and easy-to-use APIs
- 💾 **Data Persistence**: Built-in in-memory and cache manager stores for data persistence

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [🚀 Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [Installing Dependencies](#installing-dependencies)
  - [Running the Example](#running-the-example)
- [📖 Complete Tutorial](#-complete-tutorial)
  - [Setting Up Your Environment](#1-setting-up-your-environment)
  - [Cloning the Repository](#2-cloning-the-repository)
  - [Installing Dependencies](#3-installing-dependencies)
  - [Building the Project](#4-building-the-project)
  - [Running the Example Script](#5-running-the-example-script)
  - [Understanding the Code Structure](#6-understanding-the-code-structure)
- [🎯 Core Features Explained](#-core-features-explained)
  - [Stylish Terminal Interface](#stylish-terminal-interface)
  - [Connecting to WhatsApp](#connecting-to-whatsapp)
    - [QR Code Authentication](#qr-code-authentication)
    - [Pairing Code Authentication](#pairing-code-authentication)
  - [Sending Different Types of Messages](#sending-different-types-of-messages)
    - [Text Messages](#text-messages)
    - [Media Messages](#media-messages)
    - [Interactive Messages](#interactive-messages)
  - [Handling Events](#handling-events)
  - [Data Persistence with Store](#data-persistence-with-store)
    - [In-Memory Store](#in-memory-store)
    - [Cache Manager Store](#cache-manager-store)
- [🛠️ Advanced Configuration](#️advanced-configuration)
  - [Custom Logger Integration](#custom-logger-integration)
  - [Session Management](#session-management)
  - [Message Processing Pipeline](#message-processing-pipeline)
- [🤝 Contributing to the Project](#-contributing-to-the-project)
  - [Forking the Repository](#forking-the-repository)
  - [Making Changes](#making-changes)
  - [Development Setup](#development-setup)
- [📜 License Information](#-license-information)
- [⚠️ Important Disclaimer](#️important-disclaimer)
- [🔗 Useful Resources](#-useful-resources)

## 🚀 Quick Start Guide

### Prerequisites

Make sure you have the following installed:
- Node.js v16 or newer
- npm or yarn package manager
- Git (for cloning the repository)

### Installing Dependencies

**Option 1: Clone and Install (Recommended for Development)**
```bash
# Clone the repository
git clone https://github.com/BF667/Baileys.git
cd Baileys

# Install dependencies
npm install
# or
yarn install
```

**Option 2: Install Directly from GitHub (For Using as Dependency)**
```bash
# Install directly from GitHub
npm install github:BF667/Baileys
# or
yarn add github:BF667/Baileys
```

### Running the Example

```bash
# Run the example script
npm run example
# or
yarn example
```

## 📖 Complete Tutorial

### 1. Setting Up Your Environment

First, ensure you have Node.js installed (v16 or newer). You can check your version with:

```bash
node --version
npm --version
```

If you need to install or upgrade Node.js, visit [nodejs.org](https://nodejs.org/).

### 2. Cloning the Repository

Clone the BF667/Baileys repository to your local machine:

```bash
git clone https://github.com/BF667/Baileys.git
cd Baileys
```

### 3. Installing Dependencies

Install all required dependencies:

```bash
npm install
# or if using yarn
yarn install
```

### 4. Building the Project

Compile TypeScript files to JavaScript:

```bash
npm run build
# or
yarn build
```

### 5. Running the Example Script

Start the example bot to test connectivity:

```bash
npm run example
# or
yarn example
```

### 6. Understanding the Code Structure

The main components of the Baileys library are:

- `lib/` - Compiled JavaScript files
- `src/` - TypeScript source code
- `Example/` - Example implementations
- `WAProto/` - WhatsApp Protocol Buffer definitions
- `lib/Store/` - Data persistence store implementations

## 🎯 Core Features Explained

### Stylish Terminal Interface

This fork includes a beautiful terminal interface with:

```javascript
import { stylishLog } from 'baileys/lib/Utils/stylish-terminal'

// Show startup banner
stylishLog.startup()

// Log connection status
stylishLog.connection('open', '1234567890@s.whatsapp.net')

// Log messages
stylishLog.message('+1234567890@s.whatsapp.net', 'Hello World!')

// Success and error messages
stylishLog.success('Message sent successfully!')
stylishLog.error('Failed to send message')
```

### Connecting to WhatsApp

#### QR Code Authentication

```javascript
import makeWASocket from 'baileys'
import { useMultiFileAuthState } from 'baileys/lib/Utils/use-multi-file-auth-state'

async function connectWithQR() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })
  
  sock.ev.on('creds.update', saveCreds)
  
  return sock
}
```

#### Pairing Code Authentication

```javascript
async function connectWithPairingCode() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })
  
  if (!sock.authState.creds.registered) {
    const phoneNumber = '1234567890' // Replace with your phone number
    const code = await sock.requestPairingCode(phoneNumber)
    console.log('Pairing code:', code)
  }
  
  sock.ev.on('creds.update', saveCreds)
  
  return sock
}
```

### Sending Different Types of Messages

#### Text Messages

```javascript
await sock.sendMessage(jid, { text: 'Hello World!' })
```

#### Media Messages

```javascript
// Image with caption
await sock.sendMessage(jid, {
  image: { url: './path/to/image.jpg' },
  caption: 'Check out this image!'
})

// Video message
await sock.sendMessage(jid, {
  video: { url: './path/to/video.mp4' },
  caption: 'Awesome video!'
})

// Audio message
await sock.sendMessage(jid, {
  audio: { url: './path/to/audio.mp3' },
  mimetype: 'audio/mp4'
})
```

#### Interactive Messages

```javascript
// Buttons message (Legacy format)
await sock.sendMessage(jid, {
  text: 'Choose an option:',
  buttons: [
    { buttonId: 'id1', buttonText: { displayText: 'Option 1' }, type: 1 },
    { buttonId: 'id2', buttonText: { displayText: 'Option 2' }, type: 1 }
  ]
})

// List message
await sock.sendMessage(jid, {
  text: 'Select an item:',
  buttonText: 'Click here',
  sections: [
    {
      title: 'Section 1',
      rows: [
        { title: 'Item 1', rowId: 'item1' },
        { title: 'Item 2', rowId: 'item2' }
      ]
    }
  ]
})
```

### 🎯 Advanced Button Tutorial

This section provides a comprehensive tutorial on creating and using interactive buttons with Baileys.

#### Basic Button Setup

```javascript
// Import the enhanced button utilities
import { sendButtons } from 'baileys'

// Send simple quick reply buttons
await sendButtons(sock, jid, {
  text: 'Choose an option:',
  footer: 'Footer text (optional)',
  buttons: [
    { id: 'opt1', text: 'Option 1' },
    { id: 'opt2', text: 'Option 2' },
    { id: 'opt3', text: 'Option 3' }
  ]
})
```

#### Different Button Types

The enhanced button system supports multiple button types:

```javascript
// Import specific button creation functions
import { 
  sendInteractiveMessage, 
  createQuickReplyButton, 
  createUrlButton, 
  createCallButton, 
  createCopyButton, 
  createLocationButton, 
  createCatalogButton 
} from 'baileys/lib/Utils/buttons'

// 1. Quick Reply Buttons (Most Common)
const quickReplyButtons = [
  createQuickReplyButton('yes', 'Yes'),
  createQuickReplyButton('no', 'No')
]

// 2. URL Buttons (Opens links)
const urlButtons = [
  createUrlButton('Visit Website', 'https://example.com'),
  createUrlButton('Documentation', 'https://docs.example.com')
]

// 3. Call Buttons (Initiates phone call)
const callButtons = [
  createCallButton('Call Support', '+1234567890')
]

// 4. Copy Buttons (Copies text to clipboard)
const copyButtons = [
  createCopyButton('Copy Promo Code', 'PROMO10')
]

// 5. Location Buttons (Sends location)
const locationButtons = [
  createLocationButton('Send Location')
]

// 6. Catalog Buttons (For Business accounts)
const catalogButtons = [
  createCatalogButton('View Products', '+1234567890')
]
```

#### Combining Multiple Button Types

```javascript
// You can mix different button types in a single message
await sendInteractiveMessage(sock, jid, {
  text: 'We have multiple options available:',
  footer: 'Choose from the options below',
  title: 'Interactive Menu', // Optional header title
  interactiveButtons: [
    createQuickReplyButton('support', 'Contact Support'),
    createUrlButton('Documentation', 'https://docs.example.com'),
    createCallButton('Call Now', '+1234567890'),
    createCopyButton('Copy Promo', 'SAVE10')
  ]
})
```

#### Advanced Button Validation

```javascript
import { 
  validateSendButtonsPayload, 
  validateAuthoringButtons, 
  InteractiveValidationError 
} from 'baileys/lib/Utils/buttons'

// Validate button payload before sending
const buttonPayload = {
  text: 'Choose an option:',
  footer: 'Footer text',
  buttons: [
    { id: 'opt1', text: 'Option 1' },
    { id: 'opt2', text: 'Option 2' }
  ]
}

try {
  // Validate the payload
  const validation = validateSendButtonsPayload(buttonPayload)
  
  if (!validation.valid) {
    console.error('Validation errors:', validation.errors)
    console.warn('Validation warnings:', validation.warnings)
  } else {
    // Send the message if validation passes
    await sendButtons(sock, jid, buttonPayload)
  }
} catch (error) {
  if (error instanceof InteractiveValidationError) {
    console.error('Interactive validation error:', error.formatDetailed())
  } else {
    console.error('Error sending buttons:', error)
  }
}
```

#### Handling Button Responses

```javascript
// Handle button responses in message event
sock.ev.on('messages.upsert', async (m) => {
  const msg = m.messages[0]
  
  // Check if the message is a button response
  if (msg.message?.buttonsResponseMessage) {
    const selectedButtonId = msg.message.buttonsResponseMessage.selectedButtonId
    console.log(`User selected button: ${selectedButtonId}`)
    
    // Respond based on button selection
    switch(selectedButtonId) {
      case 'yes':
        await sock.sendMessage(msg.key.remoteJid, { text: 'You selected Yes!' })
        break
      case 'no':
        await sock.sendMessage(msg.key.remoteJid, { text: 'You selected No!' })
        break
      default:
        await sock.sendMessage(msg.key.remoteJid, { text: 'Thank you!' })
    }
  }
  
  // Handle native flow responses (for enhanced buttons)
  if (msg.message?.interactiveResponseMessage) {
    const response = msg.message.interactiveResponseMessage
    console.log('Native flow response:', response)
    // Process the response as needed
  }
})
```

#### Complete Button Example

```javascript
// Complete example combining all button features
import { 
  sendInteractiveMessage,
  createQuickReplyButton,
  createUrlButton,
  createCallButton,
  createCopyButton
} from 'baileys/lib/Utils/buttons'

async function sendHelpMenu(sock, jid) {
  try {
    await sendInteractiveMessage(sock, jid, {
      text: 'How can we help you today?',
      footer: 'Select an option below',
      title: 'Help Center',
      interactiveButtons: [
        // Quick reply buttons for common options
        createQuickReplyButton('support', 'Contact Support'),
        createQuickReplyButton('faq', 'View FAQ'),
        createQuickReplyButton('hours', 'Business Hours'),
        
        // URL buttons for documentation
        createUrlButton('Documentation', 'https://docs.example.com'),
        
        // Call button for immediate help
        createCallButton('Call Support', '+1234567890'),
        
        // Copy button for promo codes
        createCopyButton('Copy Help Code', 'HELP123')
      ]
    })
    
    console.log('Help menu sent successfully!')
  } catch (error) {
    console.error('Error sending help menu:', error)
  }
}

// Usage
await sendHelpMenu(sock, jid)
```

### Handling Events

```javascript
// Connection updates
sock.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect } = update
  console.log('Connection status:', connection)
})

// Incoming messages
sock.ev.on('messages.upsert', async (event) => {
  for (const msg of event.messages) {
    if (!msg.message) continue
    
    const messageContent = msg.message?.conversation || 
                          msg.message?.extendedTextMessage?.text ||
                          'Media message'
    
    console.log('Received message:', messageContent)
  }
})

// Group updates
sock.ev.on('groups.update', (updates) => {
  for (const update of updates) {
    console.log('Group update:', update)
  }
})
```

### Data Persistence with Store

This fork includes powerful data persistence capabilities through the Store module, allowing you to maintain data across sessions.

#### In-Memory Store

```javascript
import { makeInMemoryStore } from 'baileys/lib/Store'

// Create an in-memory store
const store = makeInMemoryStore({
  logger: console
})

// Bind the store to the socket events
store.bind(sock.ev)

// Access stored data
console.log('Chats:', store.chats)
console.log('Contacts:', store.contacts)
console.log('Messages:', store.messages)

// Save/load data to/from file
store.writeToFile('store-data.json')
store.readFromFile('store-data.json')
```

#### Cache Manager Store

```javascript
import { makeCacheManagerAuthState } from 'baileys/lib/Store'

// Create a cache manager store (requires cache-manager)
const cacheStore = await makeCacheManagerAuthState(
  {
    store: 'memory',
    options: {
      max: 100,
      ttl: 60
    }
  },
  'session-key'
)

// Use with socket
const sock = makeWASocket({
  auth: cacheStore.state,
  // ... other options
})

// Save credentials
await cacheStore.saveCreds()
```

## 🛠️ Advanced Configuration

### Custom Logger Integration

```javascript
import { stylishLogger } from 'baileys/lib/Utils/stylish-terminal'

const sock = makeWASocket({
  logger: stylishLogger,
  auth: state
})
```

### Session Management

```javascript
import { useMultiFileAuthState } from 'baileys/lib/Utils/use-multi-file-auth-state'

const { state, saveCreds } = await useMultiFileAuthState('sessions/my_session')

const sock = makeWASocket({
  auth: state
})

sock.ev.on('creds.update', saveCreds)
```

### Message Processing Pipeline

```javascript
sock.ev.on('messages.upsert', async (event) => {
  for (const msg of event.messages) {
    if (!msg.message || !msg.key.remoteJid) continue
    
    const jid = msg.key.remoteJid
    
    // Skip messages from ourselves
    if (msg.key.fromMe) continue
    
    // Process the message
    const messageContent = msg.message?.conversation || 
                          msg.message?.extendedTextMessage?.text ||
                          '[Media message]'
    
    // Send typing indicator
    await sock.sendPresenceUpdate('composing', jid)
    
    // Wait to simulate typing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Send reply
    await sock.sendMessage(jid, {
      text: `Echo: ${messageContent}`
    })
    
    // Mark as read
    await sock.readMessages([msg.key])
  }
})
```

## 🤝 Contributing to the Project

We welcome contributions to enhance this Baileys fork! Here's how you can help:

### Forking the Repository

1. Navigate to [https://github.com/BF667/Baileys](https://github.com/BF667/Baileys)
2. Click the "Fork" button in the top-right corner
3. Clone your forked repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Baileys.git
   cd Baileys
   ```

### Making Changes

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. Make your changes to the code

3. Test your changes thoroughly

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Add my new feature"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```

6. Create a Pull Request on GitHub

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Baileys.git
cd Baileys

# Install dependencies
yarn install

# Build the project
yarn build

# Run example
yarn example
```

## 📜 License Information

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The original Baileys library is copyrighted by its respective owners. This fork is an independent modification with additional features and enhancements.

## ⚠️ Important Disclaimer

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or its affiliates. The official WhatsApp website can be found at https://whatsapp.com.

This software is provided "as is" without warranty of any kind. Use at your own risk. Do not use this software for spamming or any other malicious activities.

## 🔗 Useful Resources

- [GitHub Repository](https://github.com/BF667/Baileys)
- [Issue Tracker](https://github.com/BF667/Baileys/issues)
- [Original Baileys](https://github.com/WhiskeySockets/Baileys)
- [WhatsApp Web](https://web.whatsapp.com)
- [WhatsApp Business API](https://www.whatsapp.com/business/api)

---

<p align="center">
  Made with ❤️ by the Baileys Community
</p>