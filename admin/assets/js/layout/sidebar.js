/**
 * ============================================================
 * GMCA Admin Portal
 * Sidebar
 * File: assets/js/layout/sidebar.js
 * ============================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (!sidebar || !sidebarToggle) {
        return;
    }

    sidebarToggle.addEventListener("click", () => {

        sidebar.classList.toggle("collapsed");

    });

});