/**
 * =============================================================================
 * GMCA Membership Management System
 * -----------------------------------------------------------------------------
 * File: auth.js
 * =============================================================================
 *
 * Authentication Manager
 *
 * Responsible for:
 * • Session initialization
 * • Authentication state
 * • Current member
 * • Route protection
 * • Logout
 *
 * This module does NOT:
 * • Make HTTP requests directly
 * • Build Authorization headers
 * • Render UI
 * • Contain page-specific logic
 *
 * =============================================================================
 */

"use strict";

const Auth = (() => {

    /* =======================================================================
       State
       ======================================================================= */

    const state = {

        initialized: false,

        authenticated: false,

        token: null,

        user: null

    };


    /* =======================================================================
       Token Helpers
       ======================================================================= */

    function getToken() {

        return Storage.get(

            CONFIG.STORAGE.TOKEN

        );

    }


    function hasToken() {

        return Storage.has(

            CONFIG.STORAGE.TOKEN

        );

    }


    /* =======================================================================
       User Helpers
       ======================================================================= */

    function setUser(user) {

        state.user = user;

        state.authenticated = !!user;

        if (user) {

            Storage.setObject(

                CONFIG.STORAGE.MEMBER,

                user

            );

        }

    }


    function clearUser() {

        state.user = null;

        state.authenticated = false;

        state.token = null;

        Storage.clearApplicationData();

    }


    /* =======================================================================
       Redirect
       ======================================================================= */

    function redirectToLogin() {

        window.location.href = "login.html";

    }


    /* =======================================================================
     Refresh Authenticated Member
     ======================================================================= */

    async function refreshUser() {

        if (!hasToken()) {

            clearUser();

            return null;

        }

        try {

            const response = await API.getCurrentUser();

            const user = response.data || response;

            state.token = getToken();

            setUser(user);

            return user;

        } catch (error) {

            console.error("Auth.refreshUser()", error);

            clearUser();

            return null;

        }
   }

    /* =======================================================================
       Require Authentication
       ======================================================================= */

    async function requireAuth() {

        if (!hasToken()) {

            redirectToLogin();

            return false;

        }

        const user = await refreshUser();

        if (!user) {

            redirectToLogin();

            return false;

        }

        return true;

    }


    /* =======================================================================
       Initialize Authentication
       ======================================================================= */

    async function initialize() {

        if (state.initialized) {

            return state.user;

        }

        state.token = getToken();

        if (!state.token) {

            redirectToLogin();

            return null;

        }

        await requireAuth();

        state.initialized = true;

        return state.user;

    }


    /* =======================================================================
       Logout
       ======================================================================= */

    function logout() {

        clearUser();

        redirectToLogin();

    }


    /* =======================================================================
       Public API
       ======================================================================= */

    return {

        initialize,

        requireAuth,

        refreshUser,

        logout,

        get user() {

            return state.user;

        },

        get token() {

            return state.token;

        },

        get isAuthenticated() {

            return state.authenticated;

        }

    };

})();

window.Auth = Auth;