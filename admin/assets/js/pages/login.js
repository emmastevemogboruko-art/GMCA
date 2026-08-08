/**
 * ============================================================
 * GMCA Admin Portal
 * Admin Login
 * File: admin/assets/js/pages/login.js
 * ============================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // Already logged in?
    if (Auth.isAuthenticated()) {

        window.location.href = "dashboard.html";
        return;

    }

    const form = document.getElementById("loginForm");

    const identifier = document.getElementById("identifier");
    const password = document.getElementById("password");

    const loginBtn = document.getElementById("loginBtn");
    const loginText = document.getElementById("loginText");
    const loginSpinner = document.getElementById("loginSpinner");

    const loginAlert = document.getElementById("loginAlert");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        loginAlert.classList.add("d-none");
        loginAlert.textContent = "";

        loginBtn.disabled = true;
        loginText.textContent = "Signing In...";
        loginSpinner.classList.remove("d-none");

        try {

            const response = await API.post(
                "/auth/login",
                {
                    identifier: identifier.value.trim(),
                    password: password.value
                }
            );

            const token = response.data.token;
            const user = response.data.user;

            // Verify Administrator role
            const isAdmin = (user.roles || []).some(role =>
                role.toLowerCase() === "administrator"
            );

            if (!isAdmin) {

                throw new Error(
                    "You are not authorized to access the Admin Portal."
                );

            }

            // Save login session
            Auth.login(token, user);

            // Redirect
            window.location.href = "dashboard.html";

        } catch (error) {

            loginAlert.textContent = error.message;
            loginAlert.classList.remove("d-none");

        } finally {

            loginBtn.disabled = false;
            loginText.textContent = "Login";
            loginSpinner.classList.add("d-none");

        }

    });

});