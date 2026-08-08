/**
 * ============================================================
 * GMCA Admin Portal
 * Storage Helper
 * ============================================================
 */

"use strict";

const Storage = {

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }

};

Object.freeze(Storage);

window.Storage = Storage;