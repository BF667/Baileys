import chalk from "chalk";
import gradient from "gradient-string";

console.log();
console.log(gradient(['cyan', 'blue'])('• Baileys Mod by BF667'));
console.log(gradient(['cyan', 'blue'])('• https://github.com/BF667/Baileys'));
console.log();

import makeWASocket from './Socket/index.js';
export * from '../WAProto/index.js';
export * from './Utils/index.js';
export * from './Types/index.js';
export * from './Defaults/index.js';
export * from './WABinary/index.js';
export * from './WAM/index.js';
export * from './WAUSync/index.js';
export * from './Store/index.js';
export { makeWASocket };
export default makeWASocket;
