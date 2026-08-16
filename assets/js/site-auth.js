/**
 * ==========================================================
 * GMCA Public Website Authentication
 * ==========================================================
 *
 * Member-aware authentication for public pages.
 *
 * Guest:
 *     Member Login
 *
 * Authenticated Member:
 *     Member Portal + Logout
 *
 * This module NEVER redirects public visitors to login.
 * ==========================================================
 */

"use strict";


const SiteAuth = (() => {

    /* ==========================================================
       State
    ========================================================== */

    const state = {

        initialized: false,

        authenticated: false,

        token: null,

        user: null

    };


    /* ==========================================================
       Storage Keys
    ========================================================== */

    const TOKEN_KEY =
        "gmca_member_token";

    const USER_KEY =
        "gmca_member";


    /* ==========================================================
       Get Token
    ========================================================== */

    function getToken() {

        return localStorage.getItem(
            TOKEN_KEY
        );

    }


    /* ==========================================================
       Get Stored User
    ========================================================== */

    function getStoredUser() {

        const stored =
            localStorage.getItem(
                USER_KEY
            );

        if (!stored) {

            return null;

        }

        try {

            return JSON.parse(stored);

        }

        catch (error) {

            console.error(
                "SiteAuth.getStoredUser()",
                error
            );

            return null;

        }

    }


    /* ==========================================================
       Clear Session
    ========================================================== */

    function clearSession() {

        localStorage.removeItem(
            TOKEN_KEY
        );

        localStorage.removeItem(
            USER_KEY
        );

        state.token = null;

        state.user = null;

        state.authenticated = false;

    }


    /* ==========================================================
       Set Authenticated State
    ========================================================== */

    function setAuthenticated(
        token,
        user
    ) {

        state.token =
            token;

        state.user =
            user;

        state.authenticated =
            !!token && !!user;

    }


    /* ==========================================================
       Determine API URL
    ========================================================== */

    function getApiBaseUrl() {

        const hostname =
            window.location.hostname;


        /*
         * Local development.
         */

        if (

            hostname === "localhost" ||

            hostname === "127.0.0.1"

        ) {

            return "http://localhost:5000/api";

        }


        /*
         * Production.
         */

        return "/api";

    }


    /* ==========================================================
       Initialize Authentication
    ========================================================== */

    async function initialize() {

        if (state.initialized) {

            return state.user;

        }


        state.initialized = true;


        /*
         * ------------------------------------------------------
         * STEP 1
         * ------------------------------------------------------
         *
         * Read the exact same session created by the
         * Member Portal login.
         */

        const token =
            getToken();

        const storedUser =
            getStoredUser();


        /*
         * No member session.
         *
         * This is a normal guest visitor.
         */

        if (!token || !storedUser) {

            state.token = null;

            state.user = null;

            state.authenticated = false;

            return null;

        }


        /*
         * ------------------------------------------------------
         * STEP 2
         * ------------------------------------------------------
         *
         * Immediately recognize the stored member.
         *
         * This means the navbar does NOT depend on the API
         * responding before it can show Member Portal.
         */

        setAuthenticated(
            token,
            storedUser
        );


        /*
         * ------------------------------------------------------
         * STEP 3
         * ------------------------------------------------------
         *
         * Verify the token against the backend.
         *
         * This is done for validation only.
         */

        try {

            const response =
                await fetch(

                    `${getApiBaseUrl()}/auth/me`,

                    {

                        method: "GET",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        }

                    }

                );


            /*
             * If the backend explicitly says the token
             * is invalid or expired, clear the session.
             */

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                clearSession();

                return null;

            }


            /*
             * For other server/network problems, KEEP the
             * stored member session.
             *
             * This is important for public-page navigation.
             */

            if (!response.ok) {

                console.warn(
                    "SiteAuth: Unable to validate session. Using stored member session."
                );

                return storedUser;

            }


            const result =
                await response.json();


            /*
             * If API confirms the user, update the stored
             * member information with the authoritative data.
             */

            if (
                result &&
                result.success &&
                result.data
            ) {

                setAuthenticated(
                    token,
                    result.data
                );


                localStorage.setItem(

                    USER_KEY,

                    JSON.stringify(
                        result.data
                    )

                );


                return result.data;

            }


            /*
             * If the API response is unexpected, keep the
             * locally stored authenticated session.
             */

            return storedUser;

        }


        catch (error) {

            /*
             * Network/CORS/API problem.
             *
             * Do NOT log the member out merely because
             * the public page cannot reach the API.
             */

            console.warn(

                "SiteAuth.initialize(): API validation unavailable. Using stored member session.",

                error

            );


            return storedUser;

        }

    }


    /* ==========================================================
       Logout
    ========================================================== */

    function logout() {

        clearSession();

        window.location.reload();

    }


    /* ==========================================================
       Public API
    ========================================================== */

    return {

        initialize,

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


/*
 * Make available globally.
 */

window.SiteAuth = SiteAuth;