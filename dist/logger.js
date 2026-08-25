"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static info(message, data) {
        console.log(`[${new Date().toISOString()}] INFO: ${message}`, data || '');
    }
    static error(message, error) {
        console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error || '');
    }
    static warn(message, data) {
        console.warn(`[${new Date().toISOString()}] WARN: ${message}`, data || '');
    }
    static query(query, duration, rows) {
        if (duration > 100) {
            // Flag queries slower than 100ms
            this.warn(`SLOW QUERY (${duration}ms)`, { query: query.substring(0, 100), rows });
        }
        else {
            this.info(`Query completed in ${duration}ms (${rows} rows)`);
        }
    }
}
exports.Logger = Logger;
