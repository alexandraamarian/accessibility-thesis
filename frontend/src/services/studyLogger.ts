import { EventLog } from '../types';

/**
 * StudyLogger batches behavior events and flushes them to the backend
 * periodically and on page unload
 */
class StudyLogger {
  private buffer: EventLog[] = [];
  private sessionId: string | null = null;
  private flushInterval: number = 8000; // 8 seconds
  private intervalId: number | null = null;

  /**
   * Initialize the logger with a session ID
   */
  initialize(sessionId: string): void {
    this.sessionId = sessionId;

    // Start periodic flushing
    this.intervalId = window.setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  /**
   * Log an event to the buffer
   */
  log(eventType: EventLog['eventType'], payload: Record<string, unknown>): void {
    if (!this.sessionId) {
      console.warn('StudyLogger not initialized with sessionId');
      return;
    }

    this.buffer.push({
      timestamp: new Date().toISOString(),
      eventType,
      payload,
    });
  }

  /**
   * Flush buffered events to the backend
   */
  private async flush(): Promise<void> {
    if (this.buffer.length === 0 || !this.sessionId) return;

    const eventsToSend = [...this.buffer];
    this.buffer = []; // Clear buffer immediately

    try {
      const response = await fetch('/api/events/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          events: eventsToSend,
        }),
      });

      if (!response.ok) {
        console.error('Failed to flush events:', response.statusText);
        // Put events back in buffer on failure
        this.buffer.unshift(...eventsToSend);
      }
    } catch (error) {
      console.error('Error flushing events:', error);
      // Put events back in buffer on error
      this.buffer.unshift(...eventsToSend);
    }
  }

  /**
   * Stop the logger and flush remaining events
   */
  destroy(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.flush();
  }
}

// Singleton instance
export const studyLogger = new StudyLogger();
