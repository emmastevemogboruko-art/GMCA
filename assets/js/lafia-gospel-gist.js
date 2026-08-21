/**
 * ==========================================================
 * GMCA — LAFIA GOSPEL GIST
 * Registration & Flutterwave Payment
 * ==========================================================
 *
 * Depends on:
 *     assets/js/site-auth.js
 *
 * Backend:
 *     POST /api/initiative-payments/initialize
 *
 * Purpose:
 *     LAFIA_GOSPEL_GIST
 *
 * Payment return:
 *     /lafia-gospel-gist.html?payment=success
 *     /lafia-gospel-gist.html?payment=failed
 *
 * ==========================================================
 */

"use strict";


const LafiaGospelGist = (() => {


    /* ==========================================================
       Configuration
    ========================================================== */

    const PAYMENT_PURPOSE =
        "LAFIA_GOSPEL_GIST";


    const LOCAL_API_BASE =
        "http://localhost:5000/api";


    const PRODUCTION_API_BASE =
        "https://gmca-lu67.onrender.com/api";


    /* ==========================================================
       DOM
    ========================================================== */

    let actionContainer = null;

    let messageContainer = null;


    /* ==========================================================
       API Base URL
    ========================================================== */

    function getApiBaseUrl() {

        const hostname =
            window.location.hostname;


        if (

            hostname === "localhost" ||

            hostname === "127.0.0.1"

        ) {

            return LOCAL_API_BASE;

        }


        return PRODUCTION_API_BASE;

    }


    /* ==========================================================
       Initialize DOM References
    ========================================================== */

    function initializeDom() {

        actionContainer =
            document.getElementById(
                "lgg-membership-action"
            );


        messageContainer =
            document.getElementById(
                "lgg-membership-message"
            );


        if (!actionContainer) {

            console.error(
                "Lafia Gospel Gist: #lgg-membership-action was not found."
            );

            return false;

        }


        return true;

    }


    /* ==========================================================
       Messages
    ========================================================== */

    function showMessage(
        message,
        type = "info"
    ) {

        if (!messageContainer) {

            return;

        }


        messageContainer.textContent =
            message;


        messageContainer.className =
            `lgg-payment-message lgg-message-${type}`;


        messageContainer.style.display =
            "block";

    }


    function clearMessage() {

        if (!messageContainer) {

            return;

        }


        messageContainer.textContent =
            "";


        messageContainer.className =
            "lgg-payment-message";


        messageContainer.style.display =
            "none";

    }


    /* ==========================================================
       Button
    ========================================================== */

    function createRegistrationButton() {

        if (!actionContainer) {

            return null;

        }


        actionContainer.innerHTML = `

            <button
                type="button"
                class="lgg-register-button"
                id="lgg-register-button"
            >
                Register for Lafia Gospel Gist
            </button>

        `;


        const button =
            document.getElementById(
                "lgg-register-button"
            );


        if (button) {

            button.addEventListener(
                "click",
                initializePayment
            );

        }


        return button;

    }


    /* ==========================================================
       Loading State
    ========================================================== */

    function setLoading(
        button,
        loading
    ) {

        if (!button) {

            return;

        }


        if (loading) {

            if (
                !button.dataset.originalText
            ) {

                button.dataset.originalText =
                    button.textContent;

            }


            button.disabled =
                true;


            button.setAttribute(
                "aria-busy",
                "true"
            );


            button.textContent =
                "Preparing secure checkout...";


            button.classList.add(
                "is-loading"
            );

        }

        else {

            button.disabled =
                false;


            button.removeAttribute(
                "aria-busy"
            );


            button.textContent =
                button.dataset.originalText ||
                "Register for Lafia Gospel Gist";


            button.classList.remove(
                "is-loading"
            );

        }

    }


    /* ==========================================================
       Guest State
    ========================================================== */

    function renderGuestState() {

        if (!actionContainer) {

            return;

        }


        actionContainer.innerHTML = `

            <div class="lgg-auth-required">

                <p class="lgg-action-note">
                    Please log in as a GMCA member
                    to register for Lafia Gospel Gist.
                </p>

                <a
                    href="login.html"
                    class="lgg-register-button"
                >
                    Member Login
                </a>

            </div>

        `;

    }


    /* ==========================================================
       Payment Success State
    ========================================================== */

    function renderSuccessState() {

        if (!actionContainer) {

            return;

        }


        actionContainer.innerHTML = `

            <div class="lgg-registration-success">

                <div
                    class="lgg-success-icon"
                    aria-hidden="true"
                >
                    ✓
                </div>

                <div class="lgg-success-content">

                    <strong>
                        Registration Successful
                    </strong>

                    <p>
                        Your Lafia Gospel Gist payment
                        has been received successfully.
                    </p>

                </div>

            </div>

        `;

    }


    /* ==========================================================
       Payment Failed State
    ========================================================== */

    function renderFailedState() {

        if (!actionContainer) {

            return;

        }


        const button =
            createRegistrationButton();


        if (button) {

            button.focus();

        }

    }


    /* ==========================================================
       Read Payment Return
    ========================================================== */

    function getPaymentReturnState() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        return params.get(
            "payment"
        );

    }


    /* ==========================================================
       Clean Payment Query From Browser URL
    ========================================================== */

    function cleanPaymentQuery() {

        const url =
            new URL(
                window.location.href
            );


        url.searchParams.delete(
            "payment"
        );


        /*
         * Keep the page/section hash if one exists.
         */

        window.history.replaceState(
            {},
            document.title,
            url.pathname +
            (
                url.search
                    ? url.search
                    : ""
            ) +
            (
                url.hash
                    ? url.hash
                    : ""
            )
        );

    }


    /* ==========================================================
       Handle Flutterwave Return
    ========================================================== */

    function handlePaymentReturn() {

        const paymentState =
            getPaymentReturnState();


        if (!paymentState) {

            return false;

        }


        if (
            paymentState ===
            "success"
        ) {

            renderSuccessState();


            showMessage(
                "Payment successful. Your Lafia Gospel Gist registration has been received.",
                "success"
            );


            cleanPaymentQuery();


            return true;

        }


        if (
            paymentState ===
            "failed"
        ) {

            renderFailedState();


            showMessage(
                "Payment was not completed. You can try again.",
                "error"
            );


            cleanPaymentQuery();


            return true;

        }


        return false;

    }


    /* ==========================================================
       Initialize Flutterwave Payment
    ========================================================== */

    async function initializePayment() {

        clearMessage();


        /*
         * SiteAuth is the authoritative authentication system
         * for the public GMCA website.
         */

        if (
            !window.SiteAuth ||
            typeof SiteAuth.initialize !==
                "function"
        ) {

            console.error(
                "Lafia Gospel Gist: SiteAuth is unavailable."
            );


            showMessage(
                "Authentication could not be initialized. Please refresh the page and try again.",
                "error"
            );


            return;

        }


        /*
         * Make sure SiteAuth has loaded and validated its
         * stored member session.
         */

        await SiteAuth.initialize();


        if (
            !SiteAuth.isAuthenticated ||
            !SiteAuth.token
        ) {

            renderGuestState();


            showMessage(
                "Please log in as a GMCA member before registering.",
                "error"
            );


            return;

        }


        const button =
            document.getElementById(
                "lgg-register-button"
            );


        setLoading(
            button,
            true
        );


        try {

            const response =
                await fetch(

                    `${getApiBaseUrl()}/initiative-payments/initialize`,

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${SiteAuth.token}`

                        },

                        body:
                            JSON.stringify({

                                purpose:
                                    PAYMENT_PURPOSE

                            })

                    }

                );


            /*
             * Try to parse the JSON response.
             */

            let result = null;


            try {

                result =
                    await response.json();

            }

            catch (parseError) {

                throw new Error(
                    "The payment server returned an invalid response."
                );

            }


            /*
             * Backend errors are deliberately surfaced to
             * the member rather than hidden.
             *
             * This also handles the backend's duplicate
             * successful-payment protection.
             */

            if (!response.ok) {

                throw new Error(

                    result &&
                    result.message

                        ? result.message

                        : "Unable to initialize payment."

                );

            }


            if (
                !result ||
                !result.success
            ) {

                throw new Error(

                    result &&
                    result.message

                        ? result.message

                        : "Payment could not be initialized."

                );

            }


            /*
             * Flutterwave initialization response.
             *
             * The exact wrapper comes from the backend
             * controller, so support the normal Flutterwave
             * link location while remaining defensive.
             */

            const paymentData =
                result.data || {};


            const paymentLink =

                paymentData.link ||

                (
                    paymentData.data &&
                    paymentData.data.link
                ) ||

                paymentData.checkout_url;


            if (!paymentLink) {

                console.error(
                    "Lafia Gospel Gist: Payment link missing.",
                    result
                );


                throw new Error(
                    "Secure payment checkout could not be created."
                );

            }


            /*
             * Tell the member what is happening before
             * leaving the page.
             */

            showMessage(
                "Opening secure Flutterwave checkout...",
                "info"
            );


            /*
             * Redirect the same browser window to Flutterwave.
             */

            window.location.assign(
                paymentLink
            );

        }

        catch (error) {

            console.error(
                "Lafia Gospel Gist payment initialization failed:",
                error
            );


            showMessage(
                error.message ||
                "Unable to start payment. Please try again.",
                "error"
            );


            setLoading(
                button,
                false
            );

        }

    }


    /* ==========================================================
       Initial Page Setup
    ========================================================== */

    async function initializePage() {

        if (!initializeDom()) {

            return;

        }


        clearMessage();


        /*
         * Flutterwave has already completed verification on the
         * backend before redirecting here.
         *
         * Therefore these query states are authoritative
         * results of the existing controller flow.
         */

        const returnedFromPayment =
            handlePaymentReturn();


        if (returnedFromPayment) {

            return;

        }


        /*
         * Make sure SiteAuth is available before deciding
         * whether the visitor is a member.
         */

        if (
            !window.SiteAuth ||
            typeof SiteAuth.initialize !==
                "function"
        ) {

            console.error(
                "Lafia Gospel Gist: SiteAuth is not loaded."
            );


            showMessage(
                "Authentication could not be loaded. Please refresh the page.",
                "error"
            );


            return;

        }


        await SiteAuth.initialize();


        /*
         * Guest visitor.
         */

        if (
            !SiteAuth.isAuthenticated
        ) {

            renderGuestState();

            return;

        }


        /*
         * Authenticated member.
         */

        createRegistrationButton();

    }


    /* ==========================================================
       Public API
    ========================================================== */

    return {

        initialize:
            initializePage,

        initializePayment

    };

})();


/* ==========================================================
   Start
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            LafiaGospelGist.initialize();

        }
    );

}

else {

    LafiaGospelGist.initialize();

}