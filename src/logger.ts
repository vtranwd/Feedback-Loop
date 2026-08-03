export class Logger {
  static info(message: string, data?: any) {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`, data || '');
  }

  static error(message: string, error?: any) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error || '');
  }

  static warn(message: string, data?: any) {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`, data || '');
  }

  static query(query: string, duration: number, rows: number) {
    if (duration > 100) {
      // Flag queries slower than 100ms
      this.warn(`SLOW QUERY (${duration}ms)`, { query: query.substring(0, 100), rows });
    } else {
      this.info(`Query completed in ${duration}ms (${rows} rows)`);
    }
  }
}