/**
 * ==========================================================
 * Activate Account
 * ==========================================================
 */

const form =
    document.getElementById(
        "activationForm"
    );

const message =
    document.getElementById(
        "message"
    );

const submitButton =
    form.querySelector(
        'button[type="submit"]'
    );

/**
 * ==========================================================
 * Read Token
 * ==========================================================
 */

const params =
    new URLSearchParams(
        window.location.search
    );

const token =
    params.get("token");

/**
 * ==========================================================
 * Submit
 * ==========================================================
 */

form.addEventListener(

    "submit",

    async function (event) {

        event.preventDefault();

        message.innerHTML = "";

        const password =
            document.getElementById(
                "password"
            ).value.trim();

        const confirmPassword =
            document.getElementById(
                "confirmPassword"
            ).value.trim();

        if (!token) {

            message.innerHTML =
                `<div class="alert alert-danger">
                    Invalid or missing activation link.
                </div>`;

            return;

        }

        if (!password || !confirmPassword) {

            message.innerHTML =
                `<div class="alert alert-danger">
                    Please complete all required fields.
                </div>`;

            return;

        }

        if (password.length < 8) {

            message.innerHTML =
                `<div class="alert alert-danger">
                    Password must be at least 8 characters long.
                </div>`;

            return;

        }

        if (password !== confirmPassword) {

            message.innerHTML =
                `<div class="alert alert-danger">
                    Passwords do not match.
                </div>`;

            return;

        }

        submitButton.disabled = true;

        submitButton.innerHTML =
            "Activating Account...";

        try {

            /*
             * Use the same server that delivered
             * this page.
             *
             * This works locally and on Render.
             */
            const response =
                await fetch(
                    "/api/auth/activate",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            token,

                            password,

                            confirmPassword

                        })

                    }
                );

            const result =
                await response.json();

            if (!result.success) {

                throw new Error(
                    result.message
                );

            }

            message.innerHTML =
                `<div class="alert alert-success">
                    <strong>Account Activated!</strong><br><br>
                    ${result.message}<br><br>
                    Redirecting to the Member Login page...
                </div>`;

            setTimeout(

                () => {

                    window.location.href =
                        "/frontend/member/login.html";

                },

                2000

            );

        }

        catch (error) {

            submitButton.disabled = false;

            submitButton.innerHTML =
                "Activate Account";

            message.innerHTML =
                `<div class="alert alert-danger">
                    ${error.message}
                </div>`;

        }

    }

);