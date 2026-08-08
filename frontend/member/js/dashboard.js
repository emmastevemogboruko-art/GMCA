/**
 * =============================================================================
 * GMCA Membership Management System
 * -----------------------------------------------------------------------------
 * File: dashboard.js
 * =============================================================================
 *
 * Dashboard Page Module
 *
 * Responsibilities
 * ----------------
 * • Render dashboard page
 * • Load member profile
 * • Load member events
 * • Display dashboard information
 * • Display membership statistics
 * • Display upcoming events
 * • Handle dashboard interactions
 *
 * This module DOES NOT:
 * • Render the application shell
 * • Render sidebar/header/footer
 * • Handle authentication
 *
 * =============================================================================
 */

"use strict";

const Dashboard = (() => {

    /* ==========================================================================
       Private State
       ========================================================================== */

    let profile = null;

    let events = [];

    let initialized = false;

    let elements = {};


    /* ==========================================================================
       Initialize Dashboard
       ========================================================================== */

    async function initialize() {

        if (initialized) {
            return;
        }

        initialized = true;

        render();

        cacheElements();

        bindEvents();

        showLoading();

        try {

            await loadDashboard();

        } catch (error) {

            handleError(error);

        } finally {

            hideLoading();

        }

    }


    /* ==========================================================================
      Render Dashboard Page
      ========================================================================== */

    function render() {

        Layout.content.innerHTML = `

    <section class="dashboard-page">

        <!-- ==========================================================
         HERO
        =========================================================== -->

        <section class="dashboard-hero">

        <div class="hero-card">

            <div class="hero-content">

                <div class="hero-heading">

                    <p
                        id="heroGreeting"
                        class="hero-greeting">

                        Welcome Back

                    </p>

                    <h1
                        id="heroMemberName"
                        class="hero-name">

                        Loading...

                    </h1>

                    <p class="hero-description">

                        Welcome to the
                        <strong>Gospel Music Community Africa</strong>
                        Member Portal.

                        Stay connected with your membership,
                        upcoming events and community activities.

                    </p>

                </div>

                <div class="hero-summary">

                    <div class="summary-item">

                        <span class="summary-label">

                            Membership No.

                        </span>

                        <span
                            id="membershipNumber"
                            class="summary-value">

                            —

                        </span>

                    </div>

                    <div class="summary-item">

                        <span class="summary-label">

                            Membership Status

                        </span>

                        <span
                            id="membershipStatus"
                            class="summary-value">

                            —

                        </span>

                    </div>

                    <div class="summary-item">

                        <span class="summary-label">

                            Member Since

                        </span>

                        <span
                            id="memberSince"
                            class="summary-value">

                            —

                        </span>

                    </div>

                </div>

            </div>

        </div>

    </section>

    <!-- ==========================================================
         STATISTICS
    =========================================================== -->

    <section class="dashboard-stats">

        <div class="stat-card">

            <div class="stat-icon">

                <i class="bi bi-patch-check-fill"></i>

            </div>

            <div class="stat-content">

                <h3
                    id="statMembershipStatus">

                    —

                </h3>

                <p>

                    Membership Status

                </p>

            </div>

        </div>

        <div class="stat-card">

            <div class="stat-icon">

                <i class="bi bi-calendar-event"></i>

            </div>

            <div class="stat-content">

                <h3
                    id="registeredEventsCount">

                    0

                </h3>

                <p>

                    Registered Events

                </p>

            </div>

        </div>

        <div class="stat-card">

            <div class="stat-icon">

                <i class="bi bi-bell-fill"></i>

            </div>

            <div class="stat-content">

                <h3
                    id="notificationCount">

                    0

                </h3>

                <p>

                    Notifications

                </p>

            </div>

        </div>

        <div class="stat-card">

            <div class="stat-icon">

                <i class="bi bi-person-badge-fill"></i>

            </div>

            <div class="stat-content">

                <h3>

                    GMCA

                </h3>

                <p>

                    Member Portal

                </p>

            </div>

        </div>

    </section>

    <!-- ==========================================================
         MAIN GRID
    =========================================================== -->

    <section class="dashboard-grid">

        <!-- Events -->

        <section class="dashboard-events">

            <div class="section-header">

                <div>

                    <h2>

                        Upcoming Events

                    </h2>

                    <p>

                        Your upcoming ministry activities.

                    </p>

                </div>

            </div>

            <div
                id="upcomingEventsList"
                class="event-list">

            </div>

        </section>

        <!-- Quick Actions -->

        <aside class="dashboard-actions">

            <div class="section-header">

                <div>

                    <h2>

                        Quick Actions

                    </h2>

                    <p>

                        Frequently used features.

                    </p>

                </div>

            </div>

            <div class="action-list">

                <a
                    href="profile.html"
                    class="action-card">

                    <div class="action-icon">

                        <i class="bi bi-person-circle"></i>

                    </div>

                    <div class="action-content">

                        <h3>

                            My Profile

                        </h3>

                        <p>

                            View and update your member profile.

                        </p>

                    </div>

                    <div class="action-arrow">

                        <i class="bi bi-chevron-right"></i>

                    </div>

                </a>

                <a
                    href="events.html"
                    class="action-card">

                    <div class="action-icon">

                        <i class="bi bi-calendar-event"></i>

                    </div>

                    <div class="action-content">

                        <h3>

                            Events

                        </h3>

                        <p>

                            Browse upcoming GMCA events.

                        </p>

                    </div>

                    <div class="action-arrow">

                        <i class="bi bi-chevron-right"></i>

                    </div>

                </a>

                <a
                    href="change-password.html"
                    class="action-card">

                    <div class="action-icon">

                        <i class="bi bi-shield-lock"></i>

                    </div>

                    <div class="action-content">

                        <h3>

                            Change Password

                        </h3>

                        <p>

                            Keep your account secure.

                        </p>

                    </div>

                    <div class="action-arrow">

                        <i class="bi bi-chevron-right"></i>

                    </div>

                </a>

            </div>

        </aside>

    </section>

    <!-- ==========================================================
         Loading Overlay
    =========================================================== -->

    <div
        id="loadingOverlay"
        class="loading-overlay d-none">

        <div
            class="spinner-border text-warning"
            role="status">

        </div>

    </div>

</section>

`;

}


    /* ==========================================================================
        Cache Elements
       ========================================================================== */

    function cacheElements() {

        elements = {

            heroGreeting:
                document.getElementById("heroGreeting"),

            heroMemberName:
                document.getElementById("heroMemberName"),

            membershipStatus:
                document.getElementById("membershipStatus"),

            memberSince:
                document.getElementById("memberSince"),

            membershipNumber:
                document.getElementById("membershipNumber"),

            statMembershipStatus:
                document.getElementById("statMembershipStatus"),

            registeredEventsCount:
                document.getElementById("registeredEventsCount"),

            notificationCount:
                document.getElementById("notificationCount"),

            upcomingEventsList:
                document.getElementById("upcomingEventsList"),

            loadingOverlay:
                document.getElementById("loadingOverlay")

        };

    }


    /* ==========================================================================
       Event Binding
       ========================================================================== */

    function bindEvents() {

        // Reserved for future dashboard actions.

    }

    /* ==========================================================================
       Dashboard Loader
       ========================================================================== */

    async function loadDashboard() {

        await loadProfile();

        await loadEvents();

        renderProfile();

        renderStatistics();

        renderUpcomingEvents();

    }


    /* ==========================================================================
       Load Member Profile
       ========================================================================== */

    async function loadProfile() {

        const response = await API.getProfile();

        profile = response.data || response;

        if (!profile) {
            return;
        }

        Layout.updateUser({

            ...profile,

            fullName: buildMemberName(profile),

            role: profile.status || "Member"

        });

    }


    /* ==========================================================================
       Load Member Events
       ========================================================================== */

    async function loadEvents() {

        let response;

        /*
        -------------------------------------------------------------
        Current API exposes getEvents().
        Keep compatibility if getMemberEvents() is added later.
        -------------------------------------------------------------
        */

        if (typeof API.getMemberEvents === "function") {

            response = await API.getMemberEvents();

        } else {

            response = await API.getEvents();

        }

        events = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
                ? response
                : [];

    }

    /* ==========================================================================
       Profile Rendering
       ========================================================================== */

    function renderProfile() {

        if (!profile) {
            return;
        }

        const fullName = buildMemberName(profile);

        setText(
            elements.heroGreeting,
            getGreeting()
        );

        setText(
            elements.heroMemberName,
            fullName
        );

        setText(
            elements.membershipStatus,
            profile.status
        );

        setText(
            elements.statMembershipStatus,
            profile.status
        );

        setText(
            elements.membershipNumber,
            profile.membership_number
        );

        setText(
            elements.memberSince,
            formatDate(profile.joined_date)
        );

    }


    /* ==========================================================================
       Statistics
       ========================================================================== */

    function renderStatistics() {

        const upcomingEvents = events.filter(event => {

            if (!event.start_date) {
                return false;
            }

            return new Date(event.start_date) >= today();

        });

        setText(
            elements.registeredEventsCount,
            events.length
        );

        setText(
            elements.upcomingEventsCount,
            upcomingEvents.length
        );

        setText(
            elements.notificationCount,
            "0"
        );

    }


    /* ==========================================================================
       Upcoming Events
       ========================================================================== */

    function renderUpcomingEvents() {

        if (!elements.upcomingEventsList) {
            return;
        }

        elements.upcomingEventsList.innerHTML = "";

        const upcoming = events
            .filter(event => {

                if (!event.start_date) {
                    return false;
                }

                return new Date(event.start_date) >= today();

            })
            .sort(
                (a, b) =>
                    new Date(a.start_date) -
                    new Date(b.start_date)
            );

        if (!upcoming.length) {

            elements.upcomingEventsList.innerHTML = `

                <div class="empty-state">

                    <i class="bi bi-calendar-x"></i>

                    <h3>No Upcoming Events</h3>

                    <p>

                        You are not currently registered
                        for any upcoming events.

                    </p>

                </div>

            `;

            return;

        }

        upcoming.forEach(event => {

            elements.upcomingEventsList.appendChild(

                createEventCard(event)

            );

        });

    }


    /* ==========================================================================
       Event Card
       ========================================================================== */

    function createEventCard(event) {

        const card = document.createElement("article");

        card.className = "event-card";

        card.innerHTML = `

            <div class="event-card-header">

                <div>

                    <h3 class="event-title">

                        ${escapeHtml(event.title || "Untitled Event")}

                    </h3>

                    <p class="event-type">

                        ${escapeHtml(event.event_type || "Event")}

                    </p>

                </div>

                <span class="badge bg-success">

                    ${event.status === "Published" ? "Open" : escapeHtml(event.status || "Open")}

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

        `;

        return card;

    }

    /* ==========================================================================
       Helpers
       ========================================================================== */

    function buildMemberName(member) {

        return [

            member.first_name,

            member.middle_name,

            member.last_name

        ]
            .filter(Boolean)
            .join(" ");

    }

    function getGreeting() {

        const hour = new Date().getHours();

        if (hour < 12) {

            return "☀️ Good Morning,";

        }

        if (hour < 18) {

            return "🌤 Good Afternoon,";

        }

        return "🌙 Good Evening,";

    }

    function formatDate(value) {

        if (!value) {
            return "—";
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


    function setText(element, value) {

        if (!element) {
            return;
        }

        element.textContent = value || "—";

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

        console.error("Dashboard:", error);

        hideLoading();

        alert(

            error.message ||

            "Unable to load dashboard."

        );

    }


    /* ==========================================================================
       Public API
       ========================================================================== */

    return {

        initialize

    };

})();


Object.freeze(Dashboard);

window.Dashboard = Dashboard;


/* ==========================================================================
   Bootstrap
   ========================================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        try {

            await Auth.initialize();

            await Layout.initialize({

                pageTitle: "Dashboard",

                activePage: "dashboard"

            });

            await Dashboard.initialize();

        }

        catch (error) {

            console.error(

                "Dashboard Bootstrap:",

                error

            );

        }

    }

);