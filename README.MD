# Baileys 

<p><em>Custom WhatsApp library built upon Baileys — enhanced, modernized, and elegant ✨</em></p>

</div>



---

## 📌 Overview

>this is a refined version of the Baileys library with cleaner API usage, exclusive features like album messaging, newsletter controls, and full-size profile uploads — tailored for modern WhatsApp automation needs.


## 📦 Installation

### Via `package.json` Fork Baileys (NPM)
@whiskeysockets/baileys
```json
"dependencies": {
  "baileys": "github:BF667/Baileys"
}
```


Or via terminal
```bash
npm install github:BF667/Baileys
```

Importing (**for those who don't fork another repository**)

ESM
```bash
import makeWASocket from 'Baileys'
```

CJS
```bash
const { default: makeWASocket } = require('Baileys')
```


---

## 🌟 Key Features

| Category         | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| 📢 Channels       | Seamlessly send messages to WhatsApp Channels.                              |
| 🖱️ Buttons         | Create interactive messages with button options and quick replies.          |
| 🖼️ Albums          | Send grouped images or videos as an album (carousel-like format).          |
| 👤 LID Grouping    | Handle group operations using the latest @lid addressing style.             |
| 🤖 AI Message Style | Add a stylized “AI” icon to messages.                                      |
| 📷 HD Profile Pics | Upload full-size profile pictures without cropping.                        |
| 🔐 Pairing Code    | Generate custom alphanumeric pairing codes.                                |
| 🛠️ Dev Experience  | Reduced noise from logs with optimized libsignal printouts.                 |

---

## 💡 Use Case Examples

<details>
<summary><strong>📬 Newsletter Control</strong></summary>

```javascript
// Create a newsletter
await sock.newsletterCreate("Elaina Updates");

// Change description
await sock.newsletterUpdateDescription("elaina@newsletter", "Fresh updates weekly");

// Send a reaction to a channel message
await sock.newsletterReactMessage("elaina@newsletter", "175", "🔥");
```

</details>

<details>
<summary><strong>📌 Interactive Messaging</strong></summary>

```javascript
const buttons = [
  { buttonId: 'btn1', buttonText: { displayText: 'Click Me' }, type: 1 },
  { buttonId: 'btn2', buttonText: { displayText: 'Visit Site' }, type: 1 }
];

const msg = {
  text: "Choose one:",
  footer: "From Elaina with love 💜",
  buttons,
  headerType: 1
};

await sock.sendMessage(id, msg, { quoted: null });
```

</details>

<details>
<summary><strong>🖼️ Send Album</strong></summary>

```javascript
const media = [
  { image: { url: "https://example.com/pic1.jpg" } },
  { video: { url: "https://example.com/clip.mp4" } }
];

await sock.sendMessage(id, { album: media, caption: "Memories 💫" }, { quoted: null });
```

</details>

<details>
<summary><strong>🔐 Pairing with Custom Code</strong></summary>

```javascript
const code = await sock.requestPairingCode("62xxxxxxxxxx", "ELAINA01");
console.log("Your Pairing Code:", code);
```

</details>

<details>
<summary><strong>📊 Poll Creation</strong></summary>

```javascript
const pollMessage = {
  name: "Favorite Color?",
  values: ["Red", "Blue", "Green"],
  selectableCount: 1
};

await sock.sendMessage(id, { poll: pollMessage });
```

</details>

<details>
<summary><strong>📍 Location Sharing</strong></summary>

```javascript
const locationMessage = {
  degreesLatitude: 37.422,
  degreesLongitude: -122.084,
  name: "Googleplex",
  address: "1600 Amphitheatre Pkwy, Mountain View, CA 94043"
};

await sock.sendMessage(id, { location: locationMessage });
```

</details>

<details>
<summary><strong>👥 Group Management</strong></summary>

```javascript
// Create group
const group = await sock.groupCreate("My New Group", [number1, number2]);

// Add participants
await sock.groupAdd(group.id, [number3, number4]);

// Change group description
await sock.groupUpdateDescription(group.id, "This is our awesome group!");
```

</details>

---

**Note:** Replace `id` with the actual recipient ID and `sock` with your WhatsApp socket connection variable.


---

<details>
  <summary>🙏 <strong>TQTO (Thanks To)</strong></summary>

Terima kasih kepada pihak-pihak yang telah memberikan dukungan, inspirasi, dan kontribusi secara langsung maupun tidak langsung dalam pengembangan proyek ini:

- **Allah SWT**  
  For all His grace and ease.

- **Parent**  
  For your continued love, prayers, and support.

- **[Nstar-Y / Nstar-bail](https://github.com/Nstar-Y)**  
  As an initial foundation and reference in the development of this system.


</details>

> [!CAUTION]
> Built on top of the WhiskeySockets/Baileys project. All original core logic credits go to their team. elaina-bail extends it with thoughtful UX and DX improvements.
