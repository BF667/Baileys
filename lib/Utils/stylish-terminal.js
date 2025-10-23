import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';

/**
 * Stylish Terminal Interface for Baileys
 */

// Initialize colorful logging
export const stylishLog = {
    /**
     * Print a stylish header for the application
     * @param {string} text - The header text to display
     */
    header(text) {
        console.log('\n');
        console.log(gradient.pastel.multiline(figlet.textSync(text, { 
            font: 'Slant',
            horizontalLayout: 'fitted'
        })));
        console.log(chalk.gray('='.repeat(60)));
        console.log('\n');
    },

    /**
     * Print a success message
     * @param {string} message - The success message to display
     */
    success(message) {
        console.log(chalk.green.bold('✓ ') + chalk.white(message));
    },

    /**
     * Print an error message
     * @param {string} message - The error message to display
     */
    error(message) {
        console.log(chalk.red.bold('✗ ') + chalk.white(message));
    },

    /**
     * Print an informational message
     * @param {string} message - The info message to display
     */
    info(message) {
        console.log(chalk.blue.bold('ℹ ') + chalk.white(message));
    },

    /**
     * Print a warning message
     * @param {string} message - The warning message to display
     */
    warn(message) {
        console.log(chalk.yellow.bold('⚠ ') + chalk.white(message));
    },

    /**
     * Print a connection status update
     * @param {string} status - The connection status
     * @param {string} jid - The JID of the connected user (optional)
     */
    connection(status, jid = null) {
        const statusColors = {
            'open': chalk.green,
            'close': chalk.red,
            'connecting': chalk.yellow,
            'connected': chalk.green
        };

        const color = statusColors[status] || chalk.white;
        let message = `Connection status: ${color.bold(status)}`;
        
        if (jid) {
            message += ` (${chalk.cyan(jid)})`;
        }
        
        console.log(chalk.magenta.bold('🔌 ') + message);
    },

    /**
     * Print a message received notification
     * @param {string} from - Sender's JID
     * @param {string} message - Message content
     */
    message(from, message) {
        console.log(
            chalk.blue.bold('💬 ') + 
            chalk.gray(`[${new Date().toLocaleTimeString()}]`) + ' ' +
            chalk.cyan.bold(from) + ': ' + 
            chalk.white(message)
        );
    },

    /**
     * Print a QR code with styling
     * @param {string} qr - The QR code string
     */
    qr(qr) {
        console.log(chalk.yellow.bold('\n📲 Scan this QR code with WhatsApp:'));
        console.log(chalk.white(qr));
        console.log(chalk.gray('Waiting for QR code scan...'));
    },

    /**
     * Print pairing code with styling
     * @param {string} code - The pairing code
     */
    pairingCode(code) {
        console.log(chalk.yellow.bold('\n🔗 Pairing Code:'));
        console.log(chalk.green.bold(`   ${code}`));
        console.log(chalk.gray('Enter this code in WhatsApp to connect'));
    },

    /**
     * Print a separator line
     */
    separator() {
        console.log(chalk.gray('-'.repeat(60)));
    },

    /**
     * Print application startup info
     */
    startup() {
        this.header('Baileys');
        console.log(chalk.gray(`WhatsApp API Client - ${new Date().getFullYear()}`));
        console.log(chalk.gray('Ready to connect...\n'));
    }
};

/**
 * Create a stylish logger with color coding
 */
export const stylishLogger = {
    level: 'info',
    
    child(obj) {
        return stylishLogger;
    },
    
    trace(obj, msg) {
        console.log(chalk.gray('[TRACE]'), typeof obj === 'string' ? obj : msg);
    },
    
    debug(obj, msg) {
        console.log(chalk.blue('[DEBUG]'), typeof obj === 'string' ? obj : msg);
    },
    
    info(obj, msg) {
        console.log(chalk.green('[INFO] '), typeof obj === 'string' ? obj : msg);
    },
    
    warn(obj, msg) {
        console.log(chalk.yellow('[WARN] '), typeof obj === 'string' ? obj : msg);
    },
    
    error(obj, msg) {
        console.log(chalk.red('[ERROR]'), typeof obj === 'string' ? obj : msg);
    }
};

export default stylishLogger;