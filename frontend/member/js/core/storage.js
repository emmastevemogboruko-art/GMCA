/**
 * =============================================================================
 * GMCA Membership Management System
 * -----------------------------------------------------------------------------
 * File: storage.js
 * =============================================================================
 *
 * Browser Storage Manager
 *
 * Responsibilities
 * ----------------
 * • Manage Local Storage
 * • Store primitive values
 * • Store objects
 * • Retrieve objects safely
 * • Remove stored values
 * • Clear GMCA application data
 *
 * This module is the ONLY place that should directly access
 * localStorage or sessionStorage.
 *
 * =============================================================================
 */

"use strict";

const Storage = (() => {

    /* =======================================================================
       Primitive Values
       ======================================================================= */

    function set(key, value) {

        try {

            localStorage.setItem(key, value);

            return true;

        } catch (error) {

            console.error("Storage.set()", error);

            return false;

        }

    }


    function get(key) {

        try {

            return localStorage.getItem(key);

        } catch (error) {

            console.error("Storage.get()", error);

            return null;

        }

    }


    function remove(key) {

        try {

            localStorage.removeItem(key);

            return true;

        } catch (error) {

            console.error("Storage.remove()", error);

            return false;

        }

    }


    function has(key) {

        return get(key) !== null;

    }


    function clear() {

        try {

            localStorage.clear();

            return true;

        } catch (error) {

            console.error("Storage.clear()", error);

            return false;

        }

    }


    /* =======================================================================
       Object Storage
       ======================================================================= */

    function setObject(key, value) {

        try {

            return set(

                key,

                JSON.stringify(value)

            );

        } catch (error) {

            console.error("Storage.setObject()", error);

            return false;

        }

    }


    function getObject(key) {

        const value = get(key);

        if (!value) {

            return null;

        }

        try {

            return JSON.parse(value);

        } catch (error) {

            console.error("Storage.getObject()", error);

            return null;

        }

    }


    /* =======================================================================
       Application Storage
       ======================================================================= */

    function clearApplicationData() {

        remove(CONFIG.STORAGE.TOKEN);

        remove(CONFIG.STORAGE.MEMBER);

    }


    /* =======================================================================
       Public API
       ======================================================================= */

    return {

        set,

        get,

        remove,

        has,

        clear,

        setObject,

        getObject,

        clearApplicationData

    };

})();

Object.freeze(Storage);

window.Storage = Storage;