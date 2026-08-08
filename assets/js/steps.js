/**
 * ==========================================================
 * GMCA Membership Portal
 * File: steps.js
 * Purpose: Render wizard step templates
 * ==========================================================
 */

window.GMCA = window.GMCA || {};

GMCA.steps = (() => {

    /**
     * ------------------------------------------------------
     * Helpers
     * ------------------------------------------------------
     */

    function application() {

        return GMCA.state.application || {};

    }

    function renderHeader(step, total, title, description) {

        return `

            <div class="wizard-header mb-5">

                <span class="badge bg-success mb-3">

                    Step ${step} of ${total}

                </span>

                <h2 class="mb-3">

                    ${title}

                </h2>

                <p class="text-muted mb-0">

                    ${description}

                </p>

            </div>

        `;

    }

    function renderFooter(showBack = true, nextText = "Continue") {

        return `

            <div class="wizard-footer mt-5">

                <div class="d-flex justify-content-between">

                    <button
                        type="button"
                        class="btn btn-outline-secondary"
                        id="previousStep"
                        ${showBack ? "" : "disabled"}>

                        <i class="bi bi-arrow-left"></i>

                        Back

                    </button>

                    <button
                        type="button"
                        class="btn btn-success"
                        id="nextStep">

                        ${nextText}

                        <i class="bi bi-arrow-right"></i>

                    </button>

                </div>

            </div>

        `;

    }

    function inputField({

        id,
        label,
        value = "",
        type = "text",
        placeholder = "",
        required = false

    }) {

        return `

            <div class="col-lg-6">

                <div class="mb-4">

                    <label
                        class="form-label"
                        for="${id}">

                        ${label}

                        ${required ? '<span class="text-danger">*</span>' : ""}

                    </label>

                    <input

                        id="${id}"

                        type="${type}"

                        class="form-control"

                        value="${value || ""}"

                        placeholder="${placeholder}"

                        ${required ? "required" : ""}>

                    <div class="invalid-feedback"></div>

                </div>

            </div>

        `;

    }

    function textareaField({

        id,
        label,
        value = "",
        rows = 5,
        placeholder = "",
        required = false

    }) {

        return `

            <div class="col-12">

                <div class="mb-4">

                    <label
                        class="form-label"
                        for="${id}">

                        ${label}

                        ${required ? '<span class="text-danger">*</span>' : ""}

                    </label>

                    <textarea

                        id="${id}"

                        class="form-control"

                        rows="${rows}"

                        placeholder="${placeholder}"

                        ${required ? "required" : ""}>${value || ""}</textarea>

                    <div class="invalid-feedback"></div>

                </div>

            </div>

        `;

    }

    /**
     * ------------------------------------------------------
     * STEP 1
     * PERSONAL INFORMATION
     * ------------------------------------------------------
     */

    function about() {

        const data = application();

        return `

            <div class="card shadow-sm border-0">

                <div class="card-body p-4 p-lg-5">

                    ${renderHeader(

                        1,
                        4,
                        "Personal Information",
                        "Tell us about yourself."

                    )}

                    <form id="aboutForm">

                        <div class="row">

                            <div class="col-12">

                                <div class="mb-4">

                                    <label
                                        class="form-label">

                                        Membership Category

                                        <span class="text-danger">*</span>

                                    </label>

                                    <select
                                        id="category_id"
                                        class="form-select"
                                        required>

                                        <option value="">

                                            Select Membership Category

                                        </option>

                                    </select>

                                    <div class="invalid-feedback"></div>

                                </div>

                            </div>

                            ${inputField({

                                id: "first_name",

                                label: "First Name",

                                value: data.first_name,

                                required: true

                            })}

                            ${inputField({

                                id: "middle_name",

                                label: "Middle Name",

                                value: data.middle_name

                            })}

                            ${inputField({

                                id: "last_name",

                                label: "Last Name",

                                value: data.last_name,

                                required: true

                            })}

                            ${inputField({

                                id: "gender",

                                label: "Gender",

                                value: data.gender,

                                placeholder: "Male or Female",

                                required: true

                            })}

                            ${inputField({

                                id: "date_of_birth",

                                label: "Date of Birth",

                                type: "date",

                                value: data.date_of_birth,

                                required: true

                            })}

                            ${inputField({

                                id: "email",

                                label: "Email Address",

                                type: "email",

                                value: data.email,

                                required: true

                            })}

                            ${inputField({

                                id: "phone",

                                label: "Phone / WhatsApp",

                                value: data.phone,

                                required: true

                            })}

                        </div>

                    </form>

                    ${renderFooter(false)}

                </div>

            </div>

        `;

    }

    /**
     * ------------------------------------------------------
     * STEP 2
     * LOCATION INFORMATION
     * ------------------------------------------------------
     */

    function locationStep() {

        const data = application();

        return `

            <div class="card shadow-sm border-0">

                <div class="card-body p-4 p-lg-5">

                    ${renderHeader(

                        2,
                        4,
                        "Location Information",
                        "Tell us where you are located."

                    )}

                    <form id="locationForm">

                        <div class="row">

                            ${inputField({

                                id: "country",

                                label: "Country",

                                value: data.country,

                                required: true

                            })}

                            ${inputField({

                                id: "state_province",

                                label: "State / Province",

                                value: data.state_province

                            })}

                            ${inputField({

                                id: "city",

                                label: "City",

                                value: data.city

                            })}

                            ${textareaField({

                                id: "postal_address",

                                label: "Postal Address",

                                value: data.postal_address,

                                rows: 3

                            })}

                        </div>

                    </form>

                    ${renderFooter()}

                </div>

            </div>

        `;

    }

    /**
     * ------------------------------------------------------
     * STEP 3
     * MINISTRY INFORMATION
     * ------------------------------------------------------
     */

    function ministryStep() {

        const data = application();

        return `

            <div class="card shadow-sm border-0">

                <div class="card-body p-4 p-lg-5">

                    ${renderHeader(

                        3,
                        4,
                        "Ministry Information",
                        "Tell us about your ministry."

                    )}

                    <form id="ministryForm">

                        <div class="row">

                            ${inputField({

                                id: "church_name",

                                label: "Church Name",

                                value: data.church_name

                            })}

                            ${inputField({

                                id: "ministry_name",

                                label: "Ministry Name",

                                value: data.ministry_name,

                                required: true

                            })}

                            ${inputField({

                                id: "denomination",

                                label: "Denomination",

                                value: data.denomination

                            })}

                            ${inputField({

                                id: "occupation",

                                label: "Occupation",

                                value: data.occupation

                            })}

                            ${textareaField({

                                id: "testimony",

                                label: "Personal Testimony",

                                value: data.testimony,

                                rows: 6,

                                required: true,

                                placeholder:
                                    "Briefly share your testimony and ministry journey."

                            })}

                            ${textareaField({

                                id: "reason_for_joining",

                                label: "Why would you like to join GMCA?",

                                value: data.reason_for_joining,

                                rows: 5,

                                required: true,

                                placeholder:
                                    "Tell us why you would like to become a GMCA member."

                            })}

                        </div>

                    </form>

                    ${renderFooter()}

                </div>

            </div>

        `;

    }

    /**
     * ------------------------------------------------------
     * STEP 4
     * REVIEW & SUBMIT
     * ------------------------------------------------------
     */

    function reviewStep() {

        const data = application();

        return `

            <div class="card shadow-sm border-0">

                <div class="card-body p-4 p-lg-5">

                    ${renderHeader(

                        4,
                        4,
                        "Review & Submit",
                        "Please review your application before submitting."

                    )}

                    <div class="card mb-4">

                        <div class="card-header">

                            <strong>

                                Personal Information

                            </strong>

                        </div>

                        <div class="card-body">

                            <div class="row">

                                <div class="col-md-6">

                                    <p>

                                        <strong>Membership Category:</strong><br>

                                        ${data.category_name || "-"}

                                    </p>

                                    <p>

                                        <strong>First Name:</strong><br>

                                        ${data.first_name || "-"}

                                    </p>

                                    <p>

                                        <strong>Middle Name:</strong><br>

                                        ${data.middle_name || "-"}

                                    </p>

                                    <p>

                                        <strong>Last Name:</strong><br>

                                        ${data.last_name || "-"}

                                    </p>

                                </div>

                                <div class="col-md-6">

                                    <p>

                                        <strong>Gender:</strong><br>

                                        ${data.gender || "-"}

                                    </p>

                                    <p>

                                        <strong>Date of Birth:</strong><br>

                                        ${data.date_of_birth || "-"}

                                    </p>

                                    <p>

                                        <strong>Email:</strong><br>

                                        ${data.email || "-"}

                                    </p>

                                    <p>

                                        <strong>Phone:</strong><br>

                                        ${data.phone || "-"}

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div class="card mb-4">

                        <div class="card-header">

                            <strong>

                                Location

                            </strong>

                        </div>

                        <div class="card-body">

                            <p>

                                <strong>Country:</strong>

                                ${data.country || "-"}

                            </p>

                            <p>

                                <strong>State / Province:</strong>

                                ${data.state_province || "-"}

                            </p>

                            <p>

                                <strong>City:</strong>

                                ${data.city || "-"}

                            </p>

                            <p>

                                <strong>Postal Address:</strong>

                                ${data.postal_address || "-"}

                            </p>

                        </div>

                    </div>

                    <div class="card mb-4">

                        <div class="card-header">

                            <strong>

                                Ministry Information

                            </strong>

                        </div>

                        <div class="card-body">

                            <p>

                                <strong>Church Name:</strong>

                                ${data.church_name || "-"}

                            </p>

                            <p>

                                <strong>Ministry Name:</strong>

                                ${data.ministry_name || "-"}

                            </p>

                            <p>

                                <strong>Denomination:</strong>

                                ${data.denomination || "-"}

                            </p>

                            <p>

                                <strong>Occupation:</strong>

                                ${data.occupation || "-"}

                            </p>

                            <hr>

                            <p>

                                <strong>Testimony</strong>

                            </p>

                            <p>

                                ${data.testimony || "-"}

                            </p>

                            <hr>

                            <p>

                                <strong>Reason For Joining GMCA</strong>

                            </p>

                            <p>

                                ${data.reason_for_joining || "-"}

                            </p>

                        </div>

                    </div>

                    <div class="form-check mt-4">

                        <input

                            class="form-check-input"

                            type="checkbox"

                            id="declaration"

                            required

                        >

                        <label

                            class="form-check-label"

                            for="declaration">

                            I confirm that all information provided is true and accurate.

                        </label>

                    </div>

                    ${renderFooter(true, "Submit Application")}

                </div>

            </div>

        `;

    }

    /**
     * ------------------------------------------------------
     * PUBLIC API
     * ------------------------------------------------------
     */

    return {

        about,

        location: locationStep,

        ministry: ministryStep,

        review: reviewStep

    };

})();