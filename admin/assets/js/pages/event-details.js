/**
 * ============================================================
 * GMCA Admin Portal
 * Event Details
 * File: admin/assets/js/pages/event-details.js
 * ============================================================
 */

"use strict";

const EventDetails = {

    eventId: null,

    event: null,

    participants: [],

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

        if (!this.eventId) {

            alert("Event not found.");

            window.location.href =
                "events.html";

            return;

        }

        await this.loadEvent();

        await this.loadParticipants();

    },

    /**
     * ==========================================
     * Logged-in Administrator
     * ==========================================
     */
    setAdminName() {

        const admin =
            Auth.getUser();

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
     * Read Event ID
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
     * Load Event
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

            this.event =
                response.data;

            this.renderEvent();

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
     * Load Participants
     * ==========================================
     */
    async loadParticipants() {

        try {

            const response =
                await API.get(

                    `/events/${this.eventId}/members`

                );

            if (!response.success) {

                throw new Error(

                    response.message ||

                    "Unable to load participants."

                );

            }

            this.participants =
                response.data || [];

            this.renderParticipants();

            this.updateStatistics();

        }

        catch (error) {

            console.error(error);

        }

    },

    /**
     * ==========================================
     * Render Event
     * ==========================================
     */
    renderEvent() {

        const event =
            this.event;

        document.getElementById(
            "eventTitle"
        ).textContent =
            event.title;

        document.getElementById(
            "eventDescription"
        ).textContent =
            event.description ||
            "No description available.";

        document.getElementById(
            "eventType"
        ).textContent =
            event.event_type ||
            "-";

        document.getElementById(
            "eventVenue"
        ).textContent =
            event.venue ||
            "-";

        document.getElementById(
            "eventLocation"
        ).textContent =
            event.location ||
            "-";

        document.getElementById(
            "eventDates"
        ).textContent =
            `${

                Utils.formatDate(
                    event.start_date
                )

            }${

                event.end_date
                    ? " - " +
                      Utils.formatDate(
                          event.end_date
                      )
                    : ""

            }`;

        document.getElementById(
            "registrationOpen"
        ).textContent =

            event.registration_open

                ? Utils.formatDate(
                    event.registration_open
                )

                : "-";

        document.getElementById(
            "registrationClose"
        ).textContent =

            event.registration_close

                ? Utils.formatDate(
                    event.registration_close
                )

                : "-";

        document.getElementById(
            "registrationFee"
        ).textContent =

            Number(
                event.registration_fee || 0
            ) > 0

                ? `${

                    event.currency || ""

                  } ${

                    Number(
                        event.registration_fee
                    ).toFixed(2)

                  }`

                : "Free";

        document.getElementById(
            "externalRegistration"
        ).innerHTML =

            event.external_registration_link

                ? `

<a
    href="${event.external_registration_link}"
    target="_blank">

    External Registration

</a>

`

                : "GMCA Registration";

        document.getElementById(
            "editEventBtn"
        ).href =

            `event-create.html?id=${event.id}`;

        document.getElementById(
            "editBtn"
        ).href =

            `event-create.html?id=${event.id}`;

        document.getElementById(
            "participantsBtn"
        ).href =

            `event-participants.html?id=${event.id}`;

        document.getElementById(
            "manageParticipantsBtn"
        ).href =

            `event-participants.html?id=${event.id}`;

    },

    /**
     * ==========================================
     * Update Statistics
     * ==========================================
     */
    updateStatistics() {

        const registered =
            this.participants.length;

        const checkedIn =
            this.participants.filter(

                participant =>

                    participant.attendance_status ===
                    "Checked In"

            ).length;

        document.getElementById(
            "registeredCount"
        ).textContent =
            registered;

        document.getElementById(
            "checkedIn"
        ).textContent =
            checkedIn;

        if (

            this.event.max_participants &&

            Number(this.event.max_participants) > 0

        ) {

            document.getElementById(
                "capacity"
            ).textContent =

                `${registered} / ${this.event.max_participants}`;

        }

        else {

            document.getElementById(
                "capacity"
            ).textContent =
                "Unlimited";

        }

        document.getElementById(
            "eventStatus"
        ).innerHTML =
            this.getStatusBadge(
                this.event.status
            );

    },

    /**
     * ==========================================
     * Render Participants
     * ==========================================
     */
    renderParticipants() {

        const tbody =
            document.getElementById(
                "participantsTableBody"
            );

        if (!tbody) return;

        if (this.participants.length === 0) {

            tbody.innerHTML = `

<tr>

<td
    colspan="6"
    class="text-center py-5 text-muted">

No participants registered yet.

</td>

</tr>

`;

            return;

        }

        tbody.innerHTML =
            this.participants.map(

                participant => `

<tr>

<td>

${participant.membership_number}

</td>

<td>

<strong>

${participant.first_name}
${participant.middle_name || ""}
${participant.last_name}

</strong>

<br>

<small class="text-muted">

${participant.email}

</small>

</td>

<td>

${participant.country || "-"}

</td>

<td>

${participant.role}

</td>

<td>

${this.getRegistrationBadge(
    participant.registration_status
)}

</td>

<td>

${this.getAttendanceBadge(
    participant.attendance_status
)}

</td>

</tr>

`

            ).join("");

    },

    /**
     * ==========================================
     * Event Status Badge
     * ==========================================
     */
    getStatusBadge(status) {

        switch (status) {

            case "Published":

                return `<span class="badge bg-success">Published</span>`;

            case "Draft":

                return `<span class="badge bg-secondary">Draft</span>`;

            case "Registration Closed":

                return `<span class="badge bg-warning text-dark">Registration Closed</span>`;

            case "Completed":

                return `<span class="badge bg-primary">Completed</span>`;

            case "Cancelled":

                return `<span class="badge bg-danger">Cancelled</span>`;

            default:

                return `<span class="badge bg-light text-dark">${status}</span>`;

        }

    },

    /**
     * ==========================================
     * Registration Badge
     * ==========================================
     */
    getRegistrationBadge(status) {

        switch (status) {

            case "Registered":

                return `<span class="badge bg-success">Registered</span>`;

            case "Cancelled":

                return `<span class="badge bg-danger">Cancelled</span>`;

            case "Waitlisted":

                return `<span class="badge bg-warning text-dark">Waitlisted</span>`;

            default:

                return `<span class="badge bg-secondary">${status || "-"}</span>`;

        }

    },

    /**
     * ==========================================
     * Attendance Badge
     * ==========================================
     */
    getAttendanceBadge(status) {

        switch (status) {

            case "Checked In":

                return `<span class="badge bg-success">Checked In</span>`;

            case "Absent":

                return `<span class="badge bg-danger">Absent</span>`;

            case "Pending":

                return `<span class="badge bg-warning text-dark">Pending</span>`;

            default:

                return `<span class="badge bg-secondary">${status || "-"}</span>`;

        }

    },

    /**
     * ==========================================
     * Delete Event
     * ==========================================
     */
    async deleteEvent() {

        if (

            !confirm(

                "Are you sure you want to delete this event?"

            )

        ) {

            return;

        }

        try {

            Utils.showLoading();

            const response =
                await API.delete(

                    `/events/${this.eventId}`

                );

            if (!response.success) {

                throw new Error(

                    response.message ||

                    "Unable to delete event."

                );

            }

            alert(
                "Event deleted successfully."
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

        const deleteBtn =
            document.getElementById(
                "deleteBtn"
            );

        if (deleteBtn) {

            deleteBtn.addEventListener(

                "click",

                () => this.deleteEvent()

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

        EventDetails.initialize();

    }

);