/*
==========================================================
GMCA Donations
==========================================================
*/

const API_BASE_URL = "http://localhost:5000/api";

const donationForm =
    document.getElementById("donationForm");

if (donationForm) {

    donationForm.addEventListener(

        "submit",

        async function (event) {

            event.preventDefault();

            const button =
                document.getElementById(
                    "donateButton"
                );

            const alertBox =
                document.getElementById(
                    "donationAlert"
                );

            const amount =
                document
                    .getElementById("donationAmount")
                    .value
                    .trim();

            const donorName =
                document
                    .getElementById("donorName")
                    .value
                    .trim();

            const donorEmail =
                document
                    .getElementById("donorEmail")
                    .value
                    .trim();

            // Clear previous messages

            alertBox.innerHTML = "";

            // Validation

            if (!amount || Number(amount) <= 0) {

                alertBox.innerHTML = `

                    <div class="alert alert-danger">

                        Please enter a valid donation amount.

                    </div>

                `;

                return;

            }

            // Disable button

            button.disabled = true;

            button.innerHTML = `

                <span class="spinner-border spinner-border-sm me-2"></span>

                Redirecting...

            `;

            try {

                const response =
                    await fetch(

                        `${API_BASE_URL}/donations/initialize`,

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                amount:

                                    Number(amount),

                                donor_name:

                                    donorName,

                                donor_email:

                                    donorEmail

                            })

                        }

                    );

                const result =
                    await response.json();

                if (

                    !response.ok ||

                    !result.success

                ) {

                    throw new Error(

                        result.message ||

                        "Unable to initialize donation."

                    );

                }

                // Flutterwave Payment Link

                const paymentLink =
                    result.data.data.link;

                if (!paymentLink) {

                    throw new Error(
                        "Payment link was not returned."
                    );

                }

                window.location.href =
                    paymentLink;

            }

            catch (error) {

                console.error(error);

                alertBox.innerHTML = `

                    <div class="alert alert-danger">

                        ${error.message}

                    </div>

                `;

                button.disabled = false;

                button.innerHTML = `

                    <i class="bi bi-heart-fill me-2"></i>

                    Donate Securely with Flutterwave

                `;

            }

        }

    );

}