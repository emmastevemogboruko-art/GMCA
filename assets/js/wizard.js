/**
 * ==========================================================
 * GMCA Membership Portal
 * Wizard Controller
 * File: wizard.js
 * ==========================================================
 */

window.GMCA = window.GMCA || {};

GMCA.wizard = (() => {

    const TOTAL_STEPS = 4;

    let currentStep = 0;

    let container = null;

    /**
     * ------------------------------------------------------
     * Initialize
     * ------------------------------------------------------
     */

    function init() {

        container = document.getElementById("wizardContainer");

        if (!container) {

            console.error("Wizard container not found.");

            return;

        }

        bindWelcome();

    }

    /**
     * ------------------------------------------------------
     * Welcome Screen
     * ------------------------------------------------------
     */

    function bindWelcome() {

        const agreement =
            document.getElementById("agreement");

        const beginButton =
            document.getElementById("beginJourney");

        if (!agreement || !beginButton)
            return;

        agreement.addEventListener("change", () => {

            beginButton.disabled = !agreement.checked;

        });

        beginButton.addEventListener(
            "click",
            startWizard
        );

    }

    /**
     * ------------------------------------------------------
     * Start Wizard
     * ------------------------------------------------------
     */

    function startWizard() {

        document
            .getElementById("welcomeCard")
            ?.classList.add("d-none");

        document
            .getElementById("wizardContent")
            ?.classList.remove("d-none");

        currentStep = 1;

        render();

    }

    /**
     * ------------------------------------------------------
     * Render Current Step
     * ------------------------------------------------------
     */

    function render() {

        switch (currentStep) {

            case 1:

                container.innerHTML =
                    GMCA.steps.about();

                loadCategories();

                break;

            case 2:

                container.innerHTML =
                    GMCA.steps.location();

                break;

            case 3:

                container.innerHTML =
                    GMCA.steps.ministry();

                break;

            case 4:

                container.innerHTML =
                    GMCA.steps.review();

                buildReview();

                break;

        }

        bindNavigation();

    }

    /**
     * ------------------------------------------------------
     * Navigation
     * ------------------------------------------------------
     */

    function bindNavigation() {

        const next =
            document.getElementById("nextStep");

        const previous =
            document.getElementById("previousStep");

        if (next) {

            next.addEventListener(
                "click",
                nextStep
            );

        }

        if (previous) {

            previous.addEventListener(
                "click",
                previousStep
            );

        }

    }

    /**
     * ------------------------------------------------------
     * Next
     * ------------------------------------------------------
     */

    async function nextStep() {

        switch (currentStep) {

            case 1:

                if (!savePersonal())
                    return;

                break;

            case 2:

                if (!saveLocation())
                    return;

                break;

            case 3:

                if (!saveMinistry())
                    return;

                break;

            case 4:

                await submitApplication();

                return;

        }

        currentStep++;

        render();

    }

    /**
     * ------------------------------------------------------
     * Previous
     * ------------------------------------------------------
     */

    function previousStep() {

        if (currentStep === 1)
            return;

        currentStep--;

        render();

    }

    /**
     * ------------------------------------------------------
     * Helpers
     * ------------------------------------------------------
     */

    function value(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value.trim()
            : "";

    }

    function application() {

        if (!GMCA.state.application) {

            GMCA.state.application = {};

        }

        return GMCA.state.application;

    }

    /**
     * ------------------------------------------------------
     * Load Membership Categories
     * ------------------------------------------------------
     */

    async function loadCategories() {

        const select = document.getElementById("category_id");

        if (!select) return;

        try {

            const categories =
                await GMCA.api.getCategories();

            select.innerHTML = `
                <option value="">
                    Select Membership Category
                </option>
            `;

            categories.forEach(category => {

                const option =
                    document.createElement("option");

                option.value = category.id;

                option.textContent = category.name;

                select.appendChild(option);

            });

            const current =
                application().category_id;

            if (current) {

                select.value = current;

            }

        }

        catch (error) {

            console.error(error);

            select.innerHTML = `
                <option value="">
                    Unable to load categories
                </option>
            `;

        }

    }

    /**
     * ------------------------------------------------------
     * Save Step 1
     * Personal Information
     * ------------------------------------------------------
     */

    function savePersonal() {

        const data = application();

        data.category_id =
            value("category_id");

        data.category_name =
            document
                .getElementById("category_id")
                ?.selectedOptions[0]
                ?.text || "";

        data.first_name =
            value("first_name");

        data.middle_name =
            value("middle_name");

        data.last_name =
            value("last_name");

        data.gender =
            value("gender");

        data.date_of_birth =
            value("date_of_birth");

        data.email =
            value("email");

        data.phone =
            value("phone");

        if (!data.category_id) {

            alert(
                "Please select a membership category."
            );

            return false;

        }

        if (!data.first_name) {

            alert(
                "First name is required."
            );

            return false;

        }

        if (!data.last_name) {

            alert(
                "Last name is required."
            );

            return false;

        }

        if (!data.email) {

            alert(
                "Email address is required."
            );

            return false;

        }

        if (!data.phone) {

            alert(
                "Phone number is required."
            );

            return false;

        }

        return true;

    }

    /**
     * ------------------------------------------------------
     * Save Step 2
     * Location Information
     * ------------------------------------------------------
     */

    function saveLocation() {

        const data = application();

        data.country =
            value("country");

        data.state_province =
            value("state_province");

        data.city =
            value("city");

        data.postal_address =
            value("postal_address");

        if (!data.country) {

            alert(
                "Country is required."
            );

            return false;

        }

        return true;

    }

    /**
     * ------------------------------------------------------
     * Save Step 3
     * Ministry Information
     * ------------------------------------------------------
     */

    function saveMinistry() {

        const data = application();

        data.church_name =
            value("church_name");

        data.ministry_name =
            value("ministry_name");

        data.denomination =
            value("denomination");

        data.occupation =
            value("occupation");

        data.testimony =
            value("testimony");

        data.reason_for_joining =
            value("reason_for_joining");

        if (!data.ministry_name) {

            alert(
                "Ministry name is required."
            );

            return false;

        }

        if (!data.testimony) {

            alert(
                "Please enter your testimony."
            );

            return false;

        }

        if (!data.reason_for_joining) {

            alert(
                "Please tell us why you want to join GMCA."
            );

            return false;

        }

        return true;

    }

    /**
     * ------------------------------------------------------
     * Build Review Screen
     * ------------------------------------------------------
     */

    function buildReview() {

        const review =
            document.getElementById(
                "reviewContent"
            );

        if (!review)
            return;

        const data =
            application();

        review.innerHTML = `

            <div class="card mb-4">

                <div class="card-header fw-bold">

                    Personal Information

                </div>

                <div class="card-body">

                    ${reviewItem("Membership Category", data.category_name)}

                    ${reviewItem("First Name", data.first_name)}

                    ${reviewItem("Middle Name", data.middle_name)}

                    ${reviewItem("Last Name", data.last_name)}

                    ${reviewItem("Gender", data.gender)}

                    ${reviewItem("Date of Birth", data.date_of_birth)}

                    ${reviewItem("Email", data.email)}

                    ${reviewItem("Phone", data.phone)}

                </div>

            </div>

            <div class="card mb-4">

                <div class="card-header fw-bold">

                    Location

                </div>

                <div class="card-body">

                    ${reviewItem("Country", data.country)}

                    ${reviewItem("State / Province", data.state_province)}

                    ${reviewItem("City", data.city)}

                    ${reviewItem("Postal Address", data.postal_address)}

                </div>

            </div>

            <div class="card">

                <div class="card-header fw-bold">

                    Ministry Information

                </div>

                <div class="card-body">

                    ${reviewItem("Church Name", data.church_name)}

                    ${reviewItem("Ministry Name", data.ministry_name)}

                    ${reviewItem("Denomination", data.denomination)}

                    ${reviewItem("Occupation", data.occupation)}

                    ${reviewItem("Testimony", data.testimony)}

                    ${reviewItem("Reason For Joining", data.reason_for_joining)}

                </div>

            </div>

        `;

    }

    /**
     * ------------------------------------------------------
     * Review Item
     * ------------------------------------------------------
     */

    function reviewItem(label, value) {

        return `

            <div class="row mb-2">

                <div class="col-md-4 fw-bold">

                    ${label}

                </div>

                <div class="col-md-8">

                    ${value || "-"}

                </div>

            </div>

        `;

    }

    /**
     * ------------------------------------------------------
     * Submit Application
     * ------------------------------------------------------
     */

    async function submitApplication() {

        const declaration =
            document.getElementById("declaration");

        if (!declaration || !declaration.checked) {

            alert(
                "Please confirm the declaration before submitting."
            );

            return;

        }

        try {

            const submitButton =
                document.getElementById("nextStep");

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML =
                    '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

            }

            const data = application();

            await GMCA.api.saveApplication(data);

            localStorage.setItem(
                "gmcaApplication",
                JSON.stringify(data)
            );

            window.location.href =
                "success.html";

        }

        catch (error) {

            console.error(error);

            alert(

                error.message ||

                "Unable to submit application."

            );

            const submitButton =
                document.getElementById("nextStep");

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML =
                    "Submit Application";

            }

        }

    }

    /**
     * ------------------------------------------------------
     * Public API
     * ------------------------------------------------------
     */

    return {

        init

    };

})();

/**
 * ------------------------------------------------------
 * Auto Initialize
 * ------------------------------------------------------
 */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        GMCA.wizard.init();

    }

);