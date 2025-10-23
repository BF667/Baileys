import { ILogger } from './logger';

/**
 * Stylish Terminal Interface for Baileys
 */

export interface StylishLog {
    /**
     * Print a stylish header for the application
     * @param text - The header text to display
     */
    header(text: string): void;

    /**
     * Print a success message
     * @param message - The success message to display
     */
    success(message: string): void;

    /**
     * Print an error message
     * @param message - The error message to display
     */
    error(message: string): void;

    /**
     * Print an informational message
     * @param message - The info message to display
     */
    info(message: string): void;

    /**
     * Print a warning message
     * @param message - The warning message to display
     */
    warn(message: string): void;

    /**
     * Print a connection status update
     * @param status - The connection status
     * @param jid - The JID of the connected user (optional)
     */
    connection(status: string, jid?: string | null): void;

    /**
     * Print a message received notification
     * @param from - Sender's JID
     * @param message - Message content
     */
    message(from: string, message: string): void;

    /**
     * Print a QR code with styling
     * @param qr - The QR code string
     */
    qr(qr: string): void;

    /**
     * Print pairing code with styling
     * @param code - The pairing code
     */
    pairingCode(code: string): void;

    /**
     * Print a separator line
     */
    separator(): void;

    /**
     * Print application startup info
     */
    startup(): void;
}

export const stylishLog: StylishLog;

/**
 * Create a stylish logger with color coding
 */
export const stylishLogger: ILogger;

export default stylishLogger;