"use strict";

// Only show banner in development or when explicitly enabled
if (typeof process !== 'undefined' && (process.env.NODE_ENV !== 'production' || process.env.BAILEYS_BANNER !== 'false')) {
    const chalk = require("chalk");
    const gradient = require("gradient-string");
    const figlet = require("figlet");
    
    // Create a more dynamic and animated terminal experience
    console.clear();
    
    // Function to create a more elaborate terminal design
    function createStylishTerminal() {
        try {
            // Create the main ASCII art title
            const title = figlet.textSync('BAILEYS', {
                font: 'Big',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 100,
                whitespaceBreak: true
            });
            
            // Print header with gradient
            console.log(gradient(["#7EC9FF", "#A8C7FF", "#D3B7FF", "#7EC9FF"]).multiline(title.split('\n')));
            
            // Create a stylish frame
            console.log();
            console.log(chalk.bold.hex("#A8C7FF")("╔" + "═".repeat(78) + "╗"));
            console.log(chalk.bold.hex("#7EC9FF")("║") + chalk.bold.hex("#A8C7FF")(" ".repeat(15) + "Advanced WhatsApp Web API - Baileys Mod" + " ".repeat(15)) + chalk.bold.hex("#7EC9FF")(" ║"));
            console.log(chalk.bold.hex("#7EC9FF")("║") + chalk.hex("#B0B0FF")(" ".repeat(22) + "Developed by: BF667" + " ".repeat(25)) + chalk.bold.hex("#7EC9FF")(" ║"));
            console.log(chalk.bold.hex("#7EC9FF")("║") + chalk.hex("#C0C0FF")(" ".repeat(20) + "Version: 1.5.0-rc.7" + " ".repeat(27)) + chalk.bold.hex("#7EC9FF")(" ║"));
            console.log(chalk.bold.hex("#A8C7FF")("╚" + "═".repeat(78) + "╝"));
            console.log();
            
            // Feature highlights with icons
            const features = [
                { icon: "📱", text: "Multi-device support enabled" },
                { icon: "🔒", text: "Secure connection protocols" },
                { icon: "⚡", text: "Optimized for performance" },
                { icon: "🔄", text: "Auto-reconnection capabilities" },
                { icon: "📊", text: "Comprehensive logging" },
                { icon: "🎨", text: "Stylish terminal interface" }
            ];
            
            console.log(chalk.bold.hex("#A8C7FF")("🌟 Key Features:"));
            features.forEach(feature => {
                console.log(chalk.hex("#7EC9FF")("  " + feature.icon) + chalk.bold.hex("#A8C7FF")(" " + feature.text));
            });
            
            console.log();
            
            // Create an animated loading bar
            console.log(chalk.bold.hex("#A8C7FF")("🚀 Initializing Baileys Connection..."));
            
            let loadingProgress = 0;
            const loadingInterval = setInterval(() => {
                loadingProgress += 10;
                const progressBar = "█".repeat(loadingProgress / 5) + "░".repeat(20 - loadingProgress / 5);
                const progressText = chalk.bold.hex("#A8C7FF")(`[${progressBar}] ${loadingProgress}%`);
                
                // Clear previous line and write new progress
                process.stdout.write(`\r${progressText}`);
                
                if (loadingProgress >= 100) {
                    clearInterval(loadingInterval);
                    console.log("\n" + chalk.bold.hex("#7EC9FF")("✅ Baileys is ready to connect to WhatsApp!"));
                    console.log(chalk.hex("#A8C7FF")("\n💡 Tip: Scan the QR code with your WhatsApp to connect"));
                    console.log();
                }
            }, 100);
            
        } catch (e) {
            // Fallback to simple banner if figlet is not available
            console.log();
            console.log(gradient(["#7EC9FF", "#A8C7FF", "#D3B7FF"])("    █████╗ ██╗   ██╗████████╗ ██████╗     ███████╗███████╗██████╗"));
            console.log(gradient(["#A8C7FF", "#D3B7FF", "#B0B0FF"])("   ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗    ██╔════╝██╔════╝██╔══██╗"));
            console.log(gradient(["#D3B7FF", "#B0B0FF", "#C0C0FF"])("   ███████║██║   ██║   ██║   ██║   ██║    ███████╗█████╗  ██████╔╝"));
            console.log(gradient(["#B0B0FF", "#C0C0FF", "#D0D0FF"])("   ██╔══██║██║   ██║   ██║   ██║   ██║    ╚════██║██╔══╝  ██╔══██╗"));
            console.log(gradient(["#C0C0FF", "#D0D0FF", "#E0E0FF"])("   ██║  ██║╚██████╔╝   ██║   ╚██████╔╝    ███████║███████╗██║  ██║"));
            console.log(gradient(["#D0D0FF", "#E0E0FF", "#F0F0FF"])("   ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝     ╚══════╝╚══════╝╚═╝  ╚═╝"));
            console.log();
            console.log(
                chalk.bold.hex("#A8C7FF")("Baileys mod by BF667") + " " +
                chalk.bold.hex("#7EC9FF")("v1.5.0-rc.7")
            );
            console.log(
                gradient(["#7EC9FF", "#D3B7FF"])("═══════════════════════════════════════════════════════════════")
            );
            console.log(chalk.bold.hex("#7EC9FF")("🚀 Baileys is ready to connect to WhatsApp!"));
            console.log();
        }
    }
    
    // Execute the stylish terminal function
    createStylishTerminal();
}

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
            __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.proto = exports.makeWASocket = void 0;

const WAProto_1 = require("../WAProto");
Object.defineProperty(exports, "proto", {
    enumerable: true,
    get: function() {
        return WAProto_1.proto;
    }
});

const Socket_1 = __importDefault(require("./Socket"));
exports.makeWASocket = Socket_1.default;

__exportStar(require("../WAProto"), exports);
__exportStar(require("./Utils"), exports);
__exportStar(require("./Types"), exports);
__exportStar(require("./Store"), exports);
__exportStar(require("./Defaults"), exports);
__exportStar(require("./WABinary"), exports);
__exportStar(require("./WAM"), exports);
__exportStar(require("./WAUSync"), exports);

exports.default = Socket_1.default;