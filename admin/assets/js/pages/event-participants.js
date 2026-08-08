/**
 * ============================================================
 * GMCA Admin Portal
 * Event Participants
 * File: admin/assets/js/pages/event-participants.js
 * ============================================================
 */

"use strict";

const EventParticipants = {

    eventId: null,

    event: null,

    participants: [],

    filteredParticipants: [],

    modal: null,

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

        this.modal =
            new bootstrap.Modal(
                document.getElementById(
                    "registerMemberModal"
                )
            );

        if (!this.eventId) {

            alert("Event not found.");

            window.location.href =
                "events.html";

            return;

        }

        await this.loadEvent();

        await this.loadParticipants();

        await this.loadMembers();

        await this.loadRoles();

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
     * Event ID
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

            document.getElementById(
                "eventTitle"
            ).textContent =
                this.event.title;

            document.getElementById(
                "backBtn"
            ).href =
                `event-details.html?id=${this.event.id}`;

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

    },

    /**
     * ==========================================
     * Load Participants
     * ==========================================
     */
    async loadParticipants() {

        try {

            Utils.showLoading();

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

            this.filteredParticipants =
                [...this.participants];

            this.updateStatistics();

            this.renderParticipants();

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
     * Load Members
     * ==========================================
     */
    async loadMembers() {

        try {

            const response =
                await API.get("/members");

            if (!response.success) {

                return;

            }

            const select =
                document.getElementById(
                    "memberSelect"
                );

            select.innerHTML =
                `
<option value="">
Select Member...
</option>
`;

            response.data.forEach(member => {

                select.innerHTML += `

<option value="${member.id}">

${member.membership_number}
-
${member.first_name}
${member.middle_name || ""}
${member.last_name}

</option>

`;

            });

        }

        catch (error) {

            console.error(error);

        }

    },

    /**
     * ==========================================
     * Load Event Roles
     * ==========================================
     */
    async loadRoles() {

        try {

            const response =
                await API.get(
                    "/event-roles"
                );

            if (!response.success) {

                return;

            }

            const select =
                document.getElementById(
                    "roleSelect"
                );

            select.innerHTML = "";

            response.data.forEach(role => {

                select.innerHTML += `

<option value="${role.id}">

${role.name}

</option>

`;

            });

        }

        catch (error) {

            console.error(error);

        }

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

        const pending =
            this.participants.filter(

                participant =>

                    participant.attendance_status ===
                    "Pending"

            ).length;

        const absent =
            this.participants.filter(

                participant =>

                    participant.attendance_status ===
                    "Absent"

            ).length;

        document.getElementById(
            "registeredCount"
        ).textContent =
            registered;

        document.getElementById(
            "checkedInCount"
        ).textContent =
            checkedIn;

        document.getElementById(
            "pendingCount"
        ).textContent =
            pending;

        document.getElementById(
            "absentCount"
        ).textContent =
            absent;

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

        const empty =
            document.getElementById(
                "emptyState"
            );

        if (!tbody) return;

        if (
            this.filteredParticipants.length === 0
        ) {

            tbody.innerHTML = "";

            empty.classList.remove("d-none");

            return;

        }

        empty.classList.add("d-none");

        tbody.innerHTML =
            this.filteredParticipants.map(

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

${this.registrationBadge(
    participant.registration_status
)}

</td>

<td>

<select
    class="form-select form-select-sm attendance-select"
    data-member="${participant.member_id}">

<option
    value="Pending"
    ${participant.attendance_status === "Pending" ? "selected" : ""}>

Pending

</option>

<option
    value="Checked In"
    ${participant.attendance_status === "Checked In" ? "selected" : ""}>

Checked In

</option>

<option
    value="Absent"
    ${participant.attendance_status === "Absent" ? "selected" : ""}>

Absent

</option>

</select>

</td>

<td class="text-center">

<button
    class="btn btn-sm btn-outline-danger remove-btn"
    data-member="${participant.member_id}">

<i class="bi bi-trash"></i>

</button>

</td>

</tr>

`

            ).join("");

        this.bindTableEvents();

    },

    /**
     * ==========================================
     * Registration Badge
     * ==========================================
     */
    registrationBadge(status) {

        switch (status) {

            case "Registered":

                return `
                    <span class="badge bg-success">
                        Registered
                    </span>
                `;

            case "Cancelled":

                return `
                    <span class="badge bg-danger">
                        Cancelled
                    </span>
                `;

            case "Waitlisted":

                return `
                    <span class="badge bg-warning text-dark">
                        Waitlisted
                    </span>
                `;

            default:

                return `
                    <span class="badge bg-secondary">
                        ${status || "-"}
                    </span>
                `;

        }

    },

    /**
     * ==========================================
     * Search
     * ==========================================
     */
    search(value) {

        value =
            value.toLowerCase();

        this.filteredParticipants =
            this.participants.filter(

                participant =>

                    participant.membership_number
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    `${participant.first_name}
                    ${participant.middle_name || ""}
                    ${participant.last_name}`
                        .toLowerCase()
                        .includes(value)

                    ||

                    participant.email
                        ?.toLowerCase()
                        .includes(value)

            );

        this.applyAttendanceFilter();

    },

    /**
     * ==========================================
     * Attendance Filter
     * ==========================================
     */
    applyAttendanceFilter() {

        const filter =
            document.getElementById(
                "attendanceFilter"
            ).value;

        let participants =
            [...this.filteredParticipants];

        if (filter) {

            participants =
                participants.filter(

                    participant =>

                        participant.attendance_status ===
                        filter

                );

        }

        const original =
            this.filteredParticipants;

        this.filteredParticipants =
            participants;

        this.renderParticipants();

        this.filteredParticipants =
            original;

    },

    /**
     * ==========================================
     * Register Member
     * ==========================================
     */
    async registerMember() {

        try {

            const data = {

                member_id:

                    document.getElementById(
                        "memberSelect"
                    ).value,

                role_id:

                    document.getElementById(
                        "roleSelect"
                    ).value,

                registration_status:
                    "Registered",

                attendance_status:

                    document.getElementById(
                        "attendanceStatus"
                    ).value,

                remarks:

                    document.getElementById(
                        "remarks"
                    ).value

            };

            const response =
                await API.post(

                    `/events/${this.eventId}/register`,

                    data

                );

            if (!response.success) {

                throw new Error(

                    response.message ||

                    "Unable to register member."

                );

            }

            this.modal.hide();

            await this.loadParticipants();

        }

        catch (error) {

            alert(error.message);

        }

    },

    /**
     * ==========================================
     * Update Attendance
     * ==========================================
     */
    async updateAttendance(
        memberId,
        status
    ) {

        try {

            await API.patch(

                `/events/${this.eventId}/attendance/${memberId}`,

                {

                    attendance_status:
                        status

                }

            );

            await this.loadParticipants();

        }

        catch (error) {

            alert(error.message);

        }

    },

    /**
     * ==========================================
     * Remove Participant
     * ==========================================
     */
    async removeParticipant(
        memberId
    ) {

        if (

            !confirm(

                "Remove this participant from the event?"

            )

        ) {

            return;

        }

        try {

            await API.delete(

                `/events/${this.eventId}/members/${memberId}`

            );

            await this.loadParticipants();

        }

        catch (error) {

            alert(error.message);

        }

    },

    /**
     * ==========================================
     * Table Events
     * ==========================================
     */
    bindTableEvents() {

        document
            .querySelectorAll(
                ".attendance-select"
            )
            .forEach(select => {

                select.addEventListener(
                    "change",

                    e => {

                        this.updateAttendance(

                            e.target.dataset.member,

                            e.target.value

                        );

                    }

                );

            });

        document
            .querySelectorAll(
                ".remove-btn"
            )
            .forEach(button => {

                button.addEventListener(

                    "click",

                    e => {

                        this.removeParticipant(

                            e.currentTarget.dataset.member

                        );

                    }

                );

            });

    },

    /**
     * ==========================================
     * Bind Events
     * ==========================================
     */
    bindEvents() {

        document
            .getElementById(
                "searchInput"
            )
            ?.addEventListener(
                "input",

                e => this.search(
                    e.target.value
                )
            );

        document
            .getElementById(
                "attendanceFilter"
            )
            ?.addEventListener(
                "change",

                () => this.applyAttendanceFilter()
            );

        document
            .getElementById(
                "refreshBtn"
            )
            ?.addEventListener(
                "click",

                () => this.loadParticipants()
            );

        document
            .getElementById(
                "registerMemberBtn"
            )
            ?.addEventListener(
                "click",

                () => this.modal.show()
            );

        document
            .getElementById(
                "emptyRegisterBtn"
            )
            ?.addEventListener(
                "click",

                () => this.modal.show()
            );

        document
            .getElementById(
                "saveRegistrationBtn"
            )
            ?.addEventListener(
                "click",

                () => this.registerMember()
            );

        document
            .getElementById(
                "logoutBtn"
            )
            ?.addEventListener(
                "click",

                () => Auth.logout()
            );

        document
            .getElementById(
                "logoutBtnTop"
            )
            ?.addEventListener(
                "click",

                () => Auth.logout()
            );

    }

};

document.addEventListener(

    "DOMContentLoaded",

    () => {

        EventParticipants.initialize();

    }

);