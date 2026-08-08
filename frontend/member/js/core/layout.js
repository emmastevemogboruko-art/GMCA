/**
 * =============================================================================
 * GMCA Membership Management System
 * -----------------------------------------------------------------------------
 * File: layout.js
 * =============================================================================
 *
 * Shared Layout Manager
 *
 * This module is responsible for rendering and managing the common member
 * application layout used throughout the Member Portal.
 *
 * Responsibilities
 * ----------------
 * • Build the application shell
 * • Render sidebar
 * • Render header
 * • Render footer
 * • Display authenticated member information
 * • Highlight active navigation
 * • Update page title
 * • Display current date
 * • Handle logout
 *
 * This module intentionally contains NO page-specific business logic.
 *
 * =============================================================================
 */

"use strict";

const Layout = (() => {

    /* =======================================================================
       Configuration
       ======================================================================= */

    const config = {

        appId: "app",

        pageTitle: "Dashboard",

        activePage: "",

        version: "2.0.0"

    };


    /* =======================================================================
       State
       ======================================================================= */

    const state = {

        initialized: false,

        user: null

    };


    /* =======================================================================
       Cached DOM Elements
       ======================================================================= */

    const elements = {

        app: null,

        sidebar: null,

        header: null,

        content: null,

        footer: null,

        memberName: null,

        memberRole: null,

        memberInitials: null,

        pageTitle: null,

        pageDate: null

    };


    /* =======================================================================
       HTML Templates
       ======================================================================= */

    const templates = {

        shell() {

            return `

<div class="app">

    <aside
        id="sidebar"
        class="sidebar">
    </aside>

    <div class="app-main">

        <header
            id="header"
            class="app-header">
        </header>

        <main class="app-content">
            <div
                id="page-content"
                class="page-container">
            </div>
        </main>

        <footer
            id="footer"
            class="app-footer">
        </footer>

    </div>

</div>

`;

        }

    };


    /* =======================================================================
       Build Layout Shell
       ======================================================================= */

    function renderShell() {

        if (!elements.app) {

            throw new Error(

                `Layout container "#${config.appId}" not found.`

            );

        }

        elements.app.innerHTML = templates.shell();

        cacheElements();

    }


    /* =======================================================================
       Cache Layout Elements
       ======================================================================= */

    function cacheElements() {

        elements.sidebar =

            document.getElementById("sidebar");

        elements.header =

            document.getElementById("header");

        elements.content =

            document.getElementById("page-content");

        elements.footer =

            document.getElementById("footer");

    }


    /* =======================================================================
       Utility Functions
       ======================================================================= */

    function $(selector) {

        return document.querySelector(selector);

    }


    function $$(selector) {

        return [...document.querySelectorAll(selector)];

    }


    function getInitials(name = "") {

        return name

            .trim()

            .split(/\s+/)

            .map(word => word[0])

            .join("")

            .substring(0, 2)

            .toUpperCase();

    }


    function formatDate() {

        return new Intl.DateTimeFormat(

            "en-GB",

            {

                weekday: "long",

                day: "numeric",

                month: "long",

                year: "numeric"

            }

        ).format(new Date());

    }

    /* =======================================================================
       Sidebar Template
       ======================================================================= */

    templates.sidebar = function () {

        return `

<div class="sidebar-brand">

    <a href="dashboard.html"
       class="brand-link"
       aria-label="GMCA Member Portal">

        <div class="brand-logo">

            <i class="bi bi-people-fill"></i>

        </div>

        <div class="brand-text">

            <h1>GMCA</h1>

            <small>Member Portal</small>

        </div>

    </a>

</div>

<nav class="sidebar-nav" aria-label="Primary Navigation">

    <div class="nav-section">

        <span class="nav-title">

            Main Menu

        </span>

        <ul class="nav flex-column">

            <li class="nav-item">

                <a
                    href="dashboard.html"
                    class="nav-link"
                    data-page="dashboard">

                    <i class="bi bi-grid-1x2-fill"></i>

                    <span>Dashboard</span>

                </a>

            </li>

            <li class="nav-item">

                <a
                    href="profile.html"
                    class="nav-link"
                    data-page="profile">

                    <i class="bi bi-person-circle"></i>

                    <span>My Profile</span>

                </a>

            </li>

            <li class="nav-item">

                <a
                    href="events.html"
                    class="nav-link"
                    data-page="events">

                    <i class="bi bi-calendar-event"></i>

                    <span>Events</span>

                </a>

            </li>

            <li class="nav-item">

                <a
                    href="change-password.html"
                    class="nav-link"
                    data-page="change-password">

                    <i class="bi bi-key-fill"></i>

                    <span>Change Password</span>

                </a>

            </li>

        </ul>

    </div>

</nav>

<div class="sidebar-footer">

    <small>

        GMCA v${config.version}

    </small>

</div>

`;

    };


    /* =======================================================================
       Header Template
       ======================================================================= */

    templates.header = function () {

        return `

<div class="header-left">

    <h1
        id="layoutPageTitle"
        class="page-title">

        ${config.pageTitle}

    </h1>

    <p
        id="layoutPageDate"
        class="page-date">

    </p>

</div>

<div class="header-right">

    <button
        class="notification-btn"
        type="button"
        aria-label="Notifications">

        <i class="bi bi-bell"></i>

    </button>

    <div class="dropdown user-dropdown">

        <button
            class="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false">

            <div
                id="memberInitials"
                class="user-avatar">

                GM

            </div>

            <div class="user-info">

                <span
                    id="memberName"
                    class="user-name">

                    Loading...

                </span>

                <span
                    id="memberRole"
                    class="user-role">

                    Member

                </span>

            </div>

        </button>

        <ul class="dropdown-menu dropdown-menu-end">

            <li>

                <a
                    class="dropdown-item"
                    href="profile.html">

                    <i class="bi bi-person"></i>

                    My Profile

                </a>

            </li>

            <li>

                <a
                    class="dropdown-item"
                    href="change-password.html">

                    <i class="bi bi-shield-lock"></i>

                    Change Password

                </a>

            </li>

            <li>

                <hr class="dropdown-divider">

            </li>

            <li>

                <button
                    id="logoutButton"
                    class="dropdown-item logout"
                    type="button">

                    <i class="bi bi-box-arrow-right"></i>

                    Logout

                </button>

            </li>

        </ul>

    </div>

</div>

`;

    };


    /* =======================================================================
       Footer Template
       ======================================================================= */

    templates.footer = function () {

        return `

<small>

    © ${new Date().getFullYear()}
    Gospel Music Community Africa.
    All Rights Reserved.

</small>

`;

    };


    /* =======================================================================
       Render Methods
       ======================================================================= */

    function renderSidebar() {

        elements.sidebar.innerHTML = templates.sidebar();

    }


    function renderHeader() {

        elements.header.innerHTML = templates.header();

    }


    function renderFooter() {

        elements.footer.innerHTML = templates.footer();

    }


    /* =======================================================================
       Cache Dynamic Elements
       ======================================================================= */

    function cacheDynamicElements() {

        elements.memberName = $("#memberName");

        elements.memberRole = $("#memberRole");

        elements.memberInitials = $("#memberInitials");

        elements.pageTitle = $("#layoutPageTitle");

        elements.pageDate = $("#layoutPageDate");

    }

    /* =======================================================================
       Update User Information
       ======================================================================= */

    function updateUser(user) {

        if (!user) {
            return;
        }

        state.user = user;

        const fullName =
            user.fullName ||
            user.name ||
            "Member";

        const role =
            user.role ||
            "Member";

        if (elements.memberName) {
            elements.memberName.textContent = fullName;
        }

        if (elements.memberRole) {
            elements.memberRole.textContent = role;
        }

        if (elements.memberInitials) {
            elements.memberInitials.textContent =
                getInitials(fullName);
        }

    }


    /* =======================================================================
       Update Page Title
       ======================================================================= */

    function setTitle(title) {

        config.pageTitle = title;

        if (elements.pageTitle) {
            elements.pageTitle.textContent = title;
        }

        document.title = `${title} | GMCA Member Portal`;

    }


    /* =======================================================================
       Update Active Navigation
       ======================================================================= */

    function setActivePage(page) {

        config.activePage = page;

        $$(".sidebar .nav-link").forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.page === page
            );

        });

    }


    /* =======================================================================
       Update Current Date
       ======================================================================= */

    function updateDate() {

        if (!elements.pageDate) {
            return;
        }

        elements.pageDate.innerHTML = `
            <i class="bi bi-calendar3"></i>
            ${formatDate()}
        `;

    }


    /* =======================================================================
       Logout
       ======================================================================= */

    function logout() {

         Auth.logout();


    }


    /* =======================================================================
       Event Binding
       ======================================================================= */

    function bindEvents() {

        const logoutButton =
            document.getElementById("logoutButton");

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );

        }

    }


    /* =======================================================================
       Destroy
       ======================================================================= */

    function destroy() {

        state.initialized = false;
        state.user = null;

        Object.keys(elements).forEach(key => {
            elements[key] = null;
        });

    }


    /* =======================================================================
       Initialize Layout
       ======================================================================= */

    async function initialize(options = {}) {

        if (state.initialized) {
            return;
        }

        Object.assign(config, options);

        elements.app =
            document.getElementById(config.appId);

        renderShell();

        renderSidebar();

        renderHeader();

        renderFooter();

        cacheDynamicElements();

        if (config.pageTitle) {
            setTitle(config.pageTitle);
        }

        if (config.activePage) {
            setActivePage(config.activePage);
        }

        updateDate();

        if (options.user) {
            updateUser(options.user);
        }

        bindEvents();

        state.initialized = true;

    }


    /* =======================================================================
       Public API
       ======================================================================= */

    return {

        initialize,

        destroy,

        logout,

        updateUser,

        updateDate,

        setTitle,

        setActivePage,

        get content() {

            return elements.content;

        },

        get user() {

            return state.user;

        }

    };

})();

window.Layout = Layout;