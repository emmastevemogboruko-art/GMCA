/**
 * =============================================================================
 * GMCA Membership Management System
 * -----------------------------------------------------------------------------
 * File: events.js
 * =============================================================================
 *
 * Member Events Page
 *
 * Responsibilities
 * ----------------
 * • Load all available events
 * • Display event statistics
 * • Search events
 * • Filter events
 * • Render event cards
 * • Allow members to join events
 *
 * =============================================================================
 */

"use strict";

const Events = (() => {

    /* ==========================================================================
       Private State
       ========================================================================== */

    let events = [];

    let filteredEvents = [];

    let initialized = false;

    let elements = {};

    /* ==========================================================================
       Initialize
       ========================================================================== */

    async function initialize() {

        if (initialized) {
            return;
        }

        initialized = true;

        cacheElements();

        bindEvents();

        updateCurrentDate();

        showLoading();

        try {

            await loadEvents();

            renderStatistics();

            renderEvents();

            populateFilters();

        }

        catch (error) {

            handleError(error);

        }

        finally {

            hideLoading();

        }

    }

    /* ==========================================================================
       Cache Elements
       ========================================================================== */

    function cacheElements() {

        elements = {

            eventsContainer:
                document.getElementById("eventsContainer"),

            emptyState:
                document.getElementById("emptyState"),

            loadingOverlay:
                document.getElementById("loadingOverlay"),

            totalEvents:
                document.getElementById("totalEvents"),

            registeredEvents:
                document.getElementById("registeredEvents"),

            upcomingEvents:
                document.getElementById("upcomingEvents"),

            searchEvents:
                document.getElementById("searchEvents"),

            eventTypeFilter:
                document.getElementById("eventTypeFilter"),

            statusFilter:
                document.getElementById("statusFilter"),

            resetFilters:
                document.getElementById("resetFilters"),

            currentDate:
                document.getElementById("currentDate"),

            logoutBtn:
                document.getElementById("logoutBtn"),

            headerLogoutBtn:
                document.getElementById("headerLogoutBtn")

        };

    }

    /* ==========================================================================
       Bind Events
       ========================================================================== */

    function bindEvents() {

        if (elements.searchEvents) {

            elements.searchEvents.addEventListener(
                "input",
                applyFilters
            );

        }

        if (elements.eventTypeFilter) {

            elements.eventTypeFilter.addEventListener(
                "change",
                applyFilters
            );

        }

        if (elements.statusFilter) {

            elements.statusFilter.addEventListener(
                "change",
                applyFilters
            );

        }

        if (elements.resetFilters) {

            elements.resetFilters.addEventListener(
                "click",
                resetFilters
            );

        }

        if (elements.logoutBtn) {

            elements.logoutBtn.addEventListener(
                "click",
                handleLogout
            );

        }

        if (elements.headerLogoutBtn) {

            elements.headerLogoutBtn.addEventListener(
                "click",
                handleLogout
            );

        }

    }

    /* ==========================================================================
       Load Events
       ========================================================================== */

    async function loadEvents() {

        const response = await API.getEvents();

        events =
            Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response?.data?.events)
                    ? response.data.events
                    : Array.isArray(response?.events)
                        ? response.events
                        : Array.isArray(response)
                            ? response
                            : [];

        filteredEvents = [...events];

    }

    /* ==========================================================================
       Statistics
       ========================================================================== */

    function renderStatistics() {

        const upcoming = events.filter(event => {

            if (!event.start_date) {
                return false;
            }

            return new Date(event.start_date) >= today();

        });

        setText(
            elements.totalEvents,
            events.length
        );

        setText(
            elements.upcomingEvents,
            upcoming.length
        );

        setText(
            elements.registeredEvents,
            events.filter(event =>

                event.registration_status ||

                event.is_registered ||

                event.registered

            ).length
        );

    }

    /* ==========================================================================
       Populate Filters
       ========================================================================== */

    function populateFilters() {

        if (elements.eventTypeFilter) {

            elements.eventTypeFilter.innerHTML = `
                <option value="">
                    All Event Types
                </option>
            `;

            const types = [

                ...new Set(

                    events

                        .map(event => event.event_type)

                        .filter(Boolean)

                )

            ].sort();

            types.forEach(type => {

                const option = document.createElement("option");

                option.value = type;

                option.textContent = type;

                elements.eventTypeFilter.appendChild(option);

            });

        }

        if (elements.statusFilter) {

            elements.statusFilter.innerHTML = `
                <option value="">
                    All Status
                </option>
            `;

            const statuses = [

                ...new Set(

                    events

                        .map(event => event.status)

                        .filter(Boolean)

                )

            ].sort();

            statuses.forEach(status => {

                const option = document.createElement("option");

                option.value = status;

                option.textContent = status;

                elements.statusFilter.appendChild(option);

            });

        }

    }

    /* ==========================================================================
       Search & Filters
       ========================================================================== */

    function applyFilters() {

        const keyword = elements.searchEvents.value
            .trim()
            .toLowerCase();

        const type = elements.eventTypeFilter.value;

        const status = elements.statusFilter.value;

        filteredEvents = events.filter(event => {

            const matchesSearch =

                !keyword ||

                (event.title || "")
                    .toLowerCase()
                    .includes(keyword) ||

                (event.description || "")
                    .toLowerCase()
                    .includes(keyword);

            const matchesType =

                !type ||

                event.event_type === type;

            const matchesStatus =

                !status ||

                event.status === status;

            return (

                matchesSearch &&

                matchesType &&

                matchesStatus

            );

        });

        renderEvents();

    }

    function resetFilters() {

        elements.searchEvents.value = "";

        elements.eventTypeFilter.value = "";

        elements.statusFilter.value = "";

        filteredEvents = [...events];

        renderEvents();

    }

    /* ==========================================================================
       Render Events
       ========================================================================== */

    function renderEvents() {

        if (!elements.eventsContainer) {
            return;
        }

        elements.eventsContainer.innerHTML = "";

        if (!filteredEvents.length) {

            elements.emptyState.classList.remove("d-none");

            return;

        }

        elements.emptyState.classList.add("d-none");

        filteredEvents

            .sort(
                (a, b) =>
                    new Date(a.start_date) -
                    new Date(b.start_date)
            )

            .forEach(event => {

                elements.eventsContainer.appendChild(

                    createEventCard(event)

                );

            });

    }

    /* ==========================================================================
       Event Card
       ========================================================================== */

    function createEventCard(event) {

        const alreadyJoined =

            event.registration_status ||

            event.is_registered ||

            event.registered;

        const card = document.createElement("article");

        card.className = "event-card";

        card.innerHTML = `

            <div class="event-card-header">

                <div>

                    <h3 class="event-card-title">

                        ${escapeHtml(event.title || "Untitled Event")}

                    </h3>

                    <div class="event-card-type">

                        ${escapeHtml(event.event_type || "Event")}

                    </div>

                </div>

                <span class="event-status status-${String(event.status || "open").toLowerCase()}">

                    ${escapeHtml(event.status || "Open")}

                </span>

            </div>

            <div class="event-card-body">

                <p>

                    <i class="bi bi-calendar-event"></i>

                    ${formatDate(event.start_date)}

                </p>

                <p>

                    <i class="bi bi-clock"></i>

                    ${event.start_time || "TBA"}

                </p>

                <p>

                    <i class="bi bi-geo-alt"></i>

                    ${escapeHtml(

                        event.venue ||

                        event.location ||

                        "Venue TBA"

                    )}

                </p>

            </div>

            <div class="event-card-footer">

                <button

                    class="btn-event ${alreadyJoined ? "btn-success" : ""}"

                    data-id="${event.id}"

                    ${alreadyJoined ? "disabled" : ""}>

                    ${alreadyJoined ? "✓ Joined" : "Join Event"}

                </button>

            </div>

        `;

        if (!alreadyJoined) {

            const button = card.querySelector(".btn-event");

            button.addEventListener(

                "click",

                async () => {

                    try {

                        button.disabled = true;

                        button.textContent = "Joining...";

                        await API.registerForEvent(event.id);

                        await loadEvents();

                        renderStatistics();

                        renderEvents();

                    }

                    catch (error) {

                        console.error(error);

                        button.disabled = false;

                        button.textContent = "Join Event";

                        alert(

                            error.message ||

                            "Unable to join this event."

                        );

                    }

                }

            );

        }

        return card;

    }

    /* ==========================================================================
       Logout
       ========================================================================== */

    async function handleLogout(event) {

        event.preventDefault();

        try {

            if (

                typeof Auth !== "undefined" &&

                typeof Auth.logout === "function"

            ) {

                Auth.logout();

                return;

            }

            Storage.clearApplicationData();

            window.location.href = "login.html";

        }

        catch (error) {

            console.error(error);

            Storage.clearApplicationData();

            window.location.href = "login.html";

        }

    }

    /* ==========================================================================
       Helpers
       ========================================================================== */

    function updateCurrentDate() {

        if (!elements.currentDate) {
            return;
        }

        elements.currentDate.textContent =

            new Date().toLocaleDateString(

                undefined,

                {

                    weekday: "long",

                    year: "numeric",

                    month: "long",

                    day: "numeric"

                }

            );

    }

    function today() {

        const now = new Date();

        now.setHours(

            0,

            0,

            0,

            0

        );

        return now;

    }

    function formatDate(value) {

        if (!value) {

            return "Date TBA";

        }

        return new Date(value).toLocaleDateString(

            undefined,

            {

                year: "numeric",

                month: "long",

                day: "numeric"

            }

        );

    }

    function setText(element, value) {

        if (!element) {
            return;
        }

        element.textContent = value ?? "0";

    }

    function escapeHtml(value) {

        return String(value)

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }

    /* ==========================================================================
       Loading
       ========================================================================== */

    function showLoading() {

        if (!elements.loadingOverlay) {
            return;
        }

        elements.loadingOverlay.classList.remove("d-none");

    }

    function hideLoading() {

        if (!elements.loadingOverlay) {
            return;
        }

        elements.loadingOverlay.classList.add("d-none");

    }

    /* ==========================================================================
       Error Handling
       ========================================================================== */

    function handleError(error) {

        console.error("Events:", error);

        alert(

            error.message ||

            "Unable to load events."

        );

    }

    /* ==========================================================================
       Public API
       ========================================================================== */

    return {

        initialize

    };

})();

Object.freeze(Events);

window.Events = Events;

/* ==========================================================================
   Bootstrap
   ========================================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        try {

            await Auth.initialize();

            /*
             * Only initialize the shared Layout shell
             * if this page is using the new architecture.
             */

            if (document.getElementById("app")) {

                await Layout.initialize({

                    pageTitle: "Events",

                    activePage: "events"

                });

            }

            await Events.initialize();

        }

        catch (error) {

            console.error(

                "Events Bootstrap:",

                error

            );

        }

    }

);