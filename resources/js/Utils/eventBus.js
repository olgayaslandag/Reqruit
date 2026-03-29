// resources/js/Utils/eventBus.js

// Simple event bus implementation using native browser events
class EventBus {
  constructor() {
    this.eventTarget = new EventTarget();
  }

  emit(eventName, detail) {
    this.eventTarget.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  on(eventName, callback) {
    this.eventTarget.addEventListener(eventName, callback);
  }

  off(eventName, callback) {
    this.eventTarget.removeEventListener(eventName, callback);
  }
}

export const eventBus = new EventBus();