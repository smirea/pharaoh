/* @flow */

export const EventEmitterMixin = function<T:Object> (target: T): Class<T & EventEmitter> {
    return Object.assign(target, {
        _eventListeners: {},

        on (event: string, callback: () => any) : () => void {
            const bucket = this._eventListeners[event] = this._eventListeners[event] || [];
            bucket.push(callback);
            return () => this.off(event, callback);
        },

        off (event: string, callback: () => any) {
            if (!this._eventListeners[event]) return;
            this._eventListeners[event] = this._eventListeners[event].filter(fn => fn !== callback);
        },

        trigger (event: string, args: Array<mixed> = []) {
            const bucket = this._eventListeners[event];
            if (!bucket) return;
            bucket.forEach(fn => fn(...args));
        },
    });
};
