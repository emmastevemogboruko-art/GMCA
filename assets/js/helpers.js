/**
 * ============================================================
 * GMCA Membership Portal
 * Helpers
 * ------------------------------------------------------------
 * Shared utility functions used throughout the application.
 * ============================================================
 */

(function () {

    "use strict";

    window.GMCA = window.GMCA || {};

    GMCA.helpers = {

        /**
         * Query Selector
         */

        $(selector, scope = document) {

            return scope.querySelector(selector);

        },

        /**
         * Query Selector All
         */

        $$(selector, scope = document) {

            return [...scope.querySelectorAll(selector)];

        },

        /**
         * Create Element
         */

        create(tag, className = "", html = "") {

            const element = document.createElement(tag);

            if (className) {

                element.className = className;

            }

            if (html) {

                element.innerHTML = html;

            }

            return element;

        },

        /**
         * Generate UUID
         */

        uuid() {

            return crypto.randomUUID();

        },

        /**
         * Smooth Scroll
         */

        scrollTop() {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        },

        /**
         * Fade In
         */

        fadeIn(element) {

            if (!element) return;

            element.animate([

                {

                    opacity: 0,

                    transform: "translateY(20px)"

                },

                {

                    opacity: 1,

                    transform: "translateY(0)"

                }

            ], {

                duration: 350,

                easing: "ease-out",

                fill: "forwards"

            });

        },

        /**
         * Fade Out
         */

        fadeOut(element) {

            if (!element) return;

            element.animate([

                {

                    opacity: 1

                },

                {

                    opacity: 0

                }

            ], {

                duration: 250,

                easing: "ease-in",

                fill: "forwards"

            });

        },

        /**
         * Show Element
         */

        show(element) {

            if (!element) return;

            element.classList.remove("d-none");

        },

        /**
         * Hide Element
         */

        hide(element) {

            if (!element) return;

            element.classList.add("d-none");

        },

        /**
         * Toggle Element
         */

        toggle(element) {

            if (!element) return;

            element.classList.toggle("d-none");

        },

        /**
         * Enable Button
         */

        enable(button) {

            if (!button) return;

            button.disabled = false;

        },

        /**
         * Disable Button
         */

        disable(button) {

            if (!button) return;

            button.disabled = true;

        },

        /**
         * Email Validation
         */

        isEmail(value) {

            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        },

        /**
         * Required Validation
         */

        required(value) {

            return String(value).trim().length > 0;

        },

        /**
         * Phone Validation
         */

        isPhone(value) {

            return /^[0-9+\-\s()]{7,20}$/.test(value);

        },

        /**
         * Debounce
         */

        debounce(callback, delay = 300) {

            let timer;

            return (...args) => {

                clearTimeout(timer);

                timer = setTimeout(() => {

                    callback(...args);

                }, delay);

            };

        },

        /**
         * Save to Local Storage
         */

        saveLocal(key, value) {

            localStorage.setItem(

                key,

                JSON.stringify(value)

            );

        },

        /**
         * Load from Local Storage
         */

        loadLocal(key) {

            const value = localStorage.getItem(key);

            return value

                ? JSON.parse(value)

                : null;

        },

        /**
         * Remove Local Storage
         */

        removeLocal(key) {

            localStorage.removeItem(key);

        },

        /**
         * Simple Toast
         */

        toast(message) {

            alert(message);

        }

    };

})();