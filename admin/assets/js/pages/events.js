/**
 * ============================================================
 * GMCA Admin Portal
 * Events
 * File: admin/assets/js/pages/events.js
 * ============================================================
 */

"use strict";

const Events = {

    events: [],

    filteredEvents: [],

    /**
     * ==========================================
     * Initialize
     * ==========================================
     */
    async initialize() {

        Auth.requireAuth();

        this.setAdminName();

        this.bindEvents();

        await this.loadEvents();

    },

    /**
     * ==========================================
     * Display Logged-in Administrator
     * ==========================================
     */
    setAdminName() {

        const admin = Auth.getUser();

        if (!admin) return;

        const adminName =
            document.getElementById("adminName");

        if (adminName) {

            adminName.textContent =
                admin.username || admin.email;

        }

    },

    /**
     * ==========================================
     * Load Events
     * ==========================================
     */
    async loadEvents() {

        try {

            Utils.showLoading();

            const response =
                await API.get("/events");

            if (!response.success) {

                throw new Error(

                    response.message ||

                    "Unable to load events."

                );

            }

            this.events = response.data || [];

            this.filteredEvents = [...this.events];

            this.updateStatistics();

            this.renderEvents();

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
     * Statistics
     * ==========================================
     */
    updateStatistics() {

        const upcoming =
            this.events.filter(event => {

                return new Date(event.start_date) >= new Date();

            }).length;

        const published =
            this.events.filter(event =>

                event.status === "Published"

            ).length;

        const draft =
            this.events.filter(event =>

                event.status === "Draft"

            ).length;

        const completed =
            this.events.filter(event =>

                event.status === "Completed"

            ).length;

        document.getElementById(
            "upcomingEvents"
        ).textContent = upcoming;

        document.getElementById(
            "publishedEvents"
        ).textContent = published;

        document.getElementById(
            "draftEvents"
        ).textContent = draft;

        document.getElementById(
            "completedEvents"
        ).textContent = completed;

    },

    /**
     * ==========================================
     * Render Events
     * ==========================================
     */
    renderEvents() {

        const tbody =
            document.getElementById(
                "eventsTableBody"
            );

        const count =
            document.getElementById(
                "eventCount"
            );

        const empty =
            document.getElementById(
                "emptyState"
            );

        if (!tbody) return;

        count.textContent =
            `${this.filteredEvents.length} Events`;

        if (this.filteredEvents.length === 0) {

            tbody.innerHTML = "";

            empty.classList.remove("d-none");

            return;

        }

        empty.classList.add("d-none");

        tbody.innerHTML =
            this.filteredEvents.map(event => `

<tr>

<td>

    <strong>

        ${event.title}

        ${

            event.is_featured

                ? `
                    <span
                        class="badge bg-warning text-dark ms-2">

                        <i class="bi bi-star-fill"></i>

                        Signature

                    </span>
                `

                : ""

        }

    </strong>

    <br>

    <small class="text-muted">

        ${event.event_type || "General Event"}

    </small>

</td>

<td>

    ${Utils.formatDate(event.start_date)}

</td>

<td>

    ${event.venue || "-"}

</td>

<td>

    ${this.getStatusBadge(event.status)}

</td>

<td>

    ${this.getRegistrationBadge(event)}

</td>

<td>

    ${this.getCapacity(event)}

</td>

<td class="text-center">

    <a
        href="event-details.html?id=${event.id}"
        class="btn btn-sm btn-outline-primary">

        <i class="bi bi-eye"></i>

    </a>

    <a
        href="event-create.html?id=${event.id}"
        class="btn btn-sm btn-outline-warning">

        <i class="bi bi-pencil"></i>

    </a>

    <a
        href="event-participants.html?id=${event.id}"
        class="btn btn-sm btn-outline-success">

        <i class="bi bi-people"></i>

    </a>

</td>

</tr>

`).join("");

    },

    /**
     * ==========================================
     * Status Badge
     * ==========================================
     */
    getStatusBadge(status) {

        switch (status) {

            case "Published":

                return `
                    <span class="badge bg-success">
                        Published
                    </span>
                `;

            case "Draft":

                return `
                    <span class="badge bg-secondary">
                        Draft
                    </span>
                `;

            case "Registration Closed":

                return `
                    <span class="badge bg-warning text-dark">
                        Registration Closed
                    </span>
                `;

            case "Completed":

                return `
                    <span class="badge bg-primary">
                        Completed
                    </span>
                `;

            case "Cancelled":

                return `
                    <span class="badge bg-danger">
                        Cancelled
                    </span>
                `;

            default:

                return `
                    <span class="badge bg-light text-dark">
                        ${status || "Unknown"}
                    </span>
                `;

        }

    },

    /**
     * ==========================================
     * Registration Badge
     * ==========================================
     */
    getRegistrationBadge(event) {

        const today = new Date();

        if (event.registration_close) {

            const closeDate =
                new Date(event.registration_close);

            if (closeDate < today) {

                return `
                    <span class="badge bg-danger">
                        Closed
                    </span>
                `;

            }

        }

        return `
            <span class="badge bg-success">
                Open
            </span>
        `;

    },

    /**
     * ==========================================
     * Capacity Display
     * ==========================================
     */
    getCapacity(event) {

        if (
            !event.max_participants ||
            event.max_participants == 0
        ) {

            return "Unlimited";

        }

        const registered =
            event.registered_count || 0;

        return `
            ${registered} / ${event.max_participants}
        `;

    },

    /**
     * ==========================================
     * Search
     * ==========================================
     */
    search(value) {

        value = value.toLowerCase().trim();

        this.filteredEvents =
            this.events.filter(event => {

                return (

                    event.title
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    event.venue
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    event.event_type
                        ?.toLowerCase()
                        .includes(value)

                );

            });

        this.applyStatusFilter();

    },

    /**
     * ==========================================
     * Status Filter
     * ==========================================
     */
    applyStatusFilter() {

        const filter =
            document.getElementById(
                "statusFilter"
            ).value;

        let events =
            [...this.filteredEvents];

        if (filter) {

            events =
                events.filter(event =>

                    event.status === filter

                );

        }

        const original =
            this.filteredEvents;

        this.filteredEvents = events;

        this.renderEvents();

        this.filteredEvents = original;

    },

    /**
     * ==========================================
     * Bind Events
     * ==========================================
     */
    bindEvents() {

        const search =
            document.getElementById(
                "searchInput"
            );

        if (search) {

            search.addEventListener(
                "input",
                e => {

                    this.search(
                        e.target.value
                    );

                }
            );

        }

        const filter =
            document.getElementById(
                "statusFilter"
            );

        if (filter) {

            filter.addEventListener(
                "change",
                () => {

                    this.applyStatusFilter();

                }
            );

        }

        const refresh =
            document.getElementById(
                "refreshBtn"
            );

        if (refresh) {

            refresh.addEventListener(
                "click",
                () => {

                    this.loadEvents();

                }
            );

        }

        const logout =
            document.getElementById(
                "logoutBtnTop"
            );

        if (logout) {

            logout.addEventListener(
                "click",
                () => Auth.logout()
            );

        }

        const sidebarLogout =
            document.getElementById(
                "logoutBtn"
            );

        if (sidebarLogout) {

            sidebarLogout.addEventListener(
                "click",
                () => Auth.logout()
            );

        }

    }

};

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Events.initialize();

    }
);