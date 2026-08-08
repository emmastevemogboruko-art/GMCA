/**
 * ============================================================
 * GMCA Admin Portal
 * Event Create / Edit
 * File: admin/assets/js/pages/event-create.js
 * ============================================================
 */

"use strict";

const EventForm = {

    eventId: null,

    /**
     * ==========================================
     * Initialize
     * ==========================================
     */
    async initialize() {

        Auth.requireAuth();

        this.setAdminName();

        this.getEventId();

        this.bindEvents();

        if (this.eventId) {

            await this.loadEvent();

        }

    },

    /**
     * ==========================================
     * Logged-in Administrator
     * ==========================================
     */
    setAdminName() {

        const admin = Auth.getUser();

        if (!admin) return;

        const adminName =
            document.getElementById(
                "adminName"
            );

        if (adminName) {

            adminName.textContent =
                admin.username || admin.email;

        }

    },

    /**
     * ==========================================
     * Read Query String
     * ==========================================
     */
    getEventId() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        this.eventId =
            params.get("id");

    },

    /**
     * ==========================================
     * Load Event (Edit Mode)
     * ==========================================
     */
    async loadEvent() {

        try {

            Utils.showLoading();

            const response =
                await API.get(
                    `/events/${this.eventId}`
                );

            if (!response.success) {

                throw new Error(

                    response.message ||

                    "Unable to load event."

                );

            }

            this.populateForm(
                response.data
            );

            document.getElementById(
                "pageTitle"
            ).textContent =
                "Edit Event";

            document.getElementById(
                "publishBtn"
            ).innerHTML = `

<i class="bi bi-check-circle me-2"></i>

Update Event

`;

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

        finally {

            Utils.hideLoading();

        }

    },

    /**
     * ==========================================
     * Populate Form
     * ==========================================
     */
    populateForm(event) {

        document.getElementById(
            "title"
        ).value =
            event.title || "";

        document.getElementById(
            "description"
        ).value =
            event.description || "";

        document.getElementById(
            "eventType"
        ).value =
            event.event_type || "";

        document.getElementById(
            "status"
        ).value =
            event.status || "Draft";

        document.getElementById(
            "startDate"
        ).value =
            event.start_date
                ? event.start_date.substring(0,10)
                : "";

        document.getElementById(
            "endDate"
        ).value =
            event.end_date
                ? event.end_date.substring(0,10)
                : "";

        document.getElementById(
            "startTime"
        ).value =
            event.start_time || "";

        document.getElementById(
            "endTime"
        ).value =
            event.end_time || "";

        document.getElementById(
            "venue"
        ).value =
            event.venue || "";

        document.getElementById(
            "location"
        ).value =
            event.location || "";

        document.getElementById(
            "registrationOpen"
        ).value =
            event.registration_open
                ? event.registration_open.substring(0,10)
                : "";

        document.getElementById(
            "registrationClose"
        ).value =
            event.registration_close
                ? event.registration_close.substring(0,10)
                : "";

        document.getElementById(
            "maxParticipants"
        ).value =
            event.max_participants || "";

        document.getElementById(
            "registrationFee"
        ).value =
            event.registration_fee || "";

        document.getElementById(
            "currency"
        ).value =
            event.currency || "";

        document.getElementById(
            "paymentGateway"
        ).value =
            event.payment_gateway || "";

        document.getElementById(
            "paymentLink"
        ).value =
            event.payment_link || "";

        document.getElementById(
            "externalRegistrationLink"
        ).value =
            event.external_registration_link || "";
        
        document.getElementById(
            "isFeatured"
        ).checked =
            event.is_featured || false;

    },

    /**
     * ==========================================
     * Collect Form Data
     * ==========================================
     */
    getFormData() {

        return {

            title:
                document.getElementById(
                    "title"
                ).value.trim(),

            description:
                document.getElementById(
                    "description"
                ).value.trim(),

            event_type:
                document.getElementById(
                    "eventType"
                ).value,

            venue:
                document.getElementById(
                    "venue"
                ).value.trim(),

            location:
                document.getElementById(
                    "location"
                ).value.trim(),

            start_date:
                document.getElementById(
                    "startDate"
                ).value,

            end_date:
                document.getElementById(
                    "endDate"
                ).value,

            start_time:
                document.getElementById(
                    "startTime"
                ).value,

            end_time:
                document.getElementById(
                    "endTime"
                ).value,

            registration_open:
                document.getElementById(
                    "registrationOpen"
                ).value,

            registration_close:
                document.getElementById(
                    "registrationClose"
                ).value,

            max_participants:
                document.getElementById(
                    "maxParticipants"
                ).value || null,

            registration_fee:
                document.getElementById(
                    "registrationFee"
                ).value || 0,

            currency:
                document.getElementById(
                    "currency"
                ).value.trim(),

            payment_required:
                Number(
                    document.getElementById(
                        "registrationFee"
                    ).value
                ) > 0,

            payment_gateway:
                document.getElementById(
                    "paymentGateway"
                ).value.trim(),

            payment_link:
                document.getElementById(
                    "paymentLink"
                ).value.trim(),

            external_registration_link:
                document.getElementById(
                    "externalRegistrationLink"
                ).value.trim(),

            status:
                document.getElementById(
                    "status"
                ).value,
            is_featured:
                document.getElementById(
                    "isFeatured"
                ).checked

        };

    },

    /**
     * ==========================================
     * Validate Form
     * ==========================================
     */
    validate(data) {

        if (!data.title) {

            throw new Error(
                "Event title is required."
            );

        }

        if (!data.start_date) {

            throw new Error(
                "Start date is required."
            );

        }

        if (

            data.end_date &&

            new Date(data.end_date) <

            new Date(data.start_date)

        ) {

            throw new Error(
                "End date cannot be earlier than the start date."
            );

        }

    },

    /**
     * ==========================================
     * Save Draft
     * ==========================================
     */
    async saveDraft() {

        const data =
            this.getFormData();

        data.status = "Draft";

        await this.save(data);

    },

    /**
     * ==========================================
     * Publish / Update Event
     * ==========================================
     */
    async publish() {

        const data =
            this.getFormData();

        if (!this.eventId) {

            data.status = "Published";

        }

        await this.save(data);

    },

    /**
     * ==========================================
     * Save Event
     * ==========================================
     */
    async save(data) {

        try {

            this.validate(data);

            Utils.showLoading();

            let response;

            if (this.eventId) {

                response =
                    await API.put(

                        `/events/${this.eventId}`,

                        data

                    );

            }

            else {

                response =
                    await API.post(

                        "/events",

                        data

                    );

            }

            if (!response.success) {

                throw new Error(

                    response.message ||

                    "Unable to save event."

                );

            }

            alert(

                this.eventId

                    ? "Event updated successfully."

                    : "Event created successfully."

            );

            window.location.href =
                "events.html";

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

        finally {

            Utils.hideLoading();

        }

    },

    /**
     * ==========================================
     * Bind Events
     * ==========================================
     */
    bindEvents() {

        const form =
            document.getElementById(
                "eventForm"
            );

        if (form) {

            form.addEventListener(
                "submit",
                async e => {

                    e.preventDefault();

                    await this.publish();

                }
            );

        }

        const draft =
            document.getElementById(
                "saveDraftBtn"
            );

        if (draft) {

            draft.addEventListener(
                "click",
                async () => {

                    await this.saveDraft();

                }
            );

        }

        const logoutTop =
            document.getElementById(
                "logoutBtnTop"
            );

        if (logoutTop) {

            logoutTop.addEventListener(
                "click",
                () => Auth.logout()
            );

        }

        const logoutSide =
            document.getElementById(
                "logoutBtn"
            );

        if (logoutSide) {

            logoutSide.addEventListener(
                "click",
                () => Auth.logout()
            );

        }

    }

};

document.addEventListener(

    "DOMContentLoaded",

    () => {

        EventForm.initialize();

    }

);