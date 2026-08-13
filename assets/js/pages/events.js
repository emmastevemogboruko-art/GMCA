/**
 * ==========================================================
 * GMCA Website
 * Events Page
 * ==========================================================
 */

"use strict";

/* ==========================================================
   Configuration
========================================================== */

const API_BASE_URL =
    "https://gmca-lu67.onrender.com/api";

/* ==========================================================
   DOM Elements
========================================================== */

const upcomingContainer =
    document.getElementById(
        "upcoming-events-container"
    );

const signatureContainer =
    document.getElementById(
        "signature-events-container"
    );

/* ==========================================================
   Logged-in Member
========================================================== */

function getMemberToken() {

    return localStorage.getItem(
        "member_token"
    );

}

function isLoggedIn() {

    return !!getMemberToken();

}

/* ==========================================================
   Helpers
========================================================== */

function formatDate(date) {

    if (!date) {

        return "";

    }

    return new Date(date).toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}

function formatDateRange(start, end) {

    if (!start) {

        return "";

    }

    if (!end || start === end) {

        return formatDate(start);

    }

    return `${formatDate(start)} - ${formatDate(end)}`;

}

function eventBadge(event) {

    let badgeClass = "bg-success";

    switch (event.registration_message) {

        case "Registration Closed":

            badgeClass = "bg-danger";
            break;

        case "Registration Opens Soon":

            badgeClass = "bg-warning text-dark";
            break;

        case "Event Full":

            badgeClass = "bg-dark";
            break;

        default:

            badgeClass = "bg-success";

    }

    return `
        <span class="badge ${badgeClass}">
            ${event.registration_message}
        </span>
    `;

}

/* ==========================================================
   Event Card
========================================================== */

function buildEventCard(event) {

    const button =

        isLoggedIn()

            ? buildMemberButton(event)

            : buildVisitorButton();

    const slots =

        event.remaining_capacity === null

            ? "Unlimited"

            : `${event.remaining_capacity} Places Left`;

    return `

        <div class="col-lg-4 col-md-6">

            <div class="event-card h-100">

                <div class="event-image">

                    <img
                        src="${
                            event.banner_image ||

                            "assets/images/events/default-event.jpg"
                        }"

                        class="img-fluid"

                        alt="${event.title}"
                    >

                    <div class="event-badge">

                        ${eventBadge(event)}

                    </div>

                </div>

                <div class="event-content">

                    <small class="text-warning fw-semibold">

                        ${event.event_type || "GMCA Event"}

                    </small>

                    <h4 class="mt-2">

                        ${event.title}

                    </h4>

                    <p class="text-muted">

                        ${
                            event.description

                                ? event.description.substring(
                                      0,
                                      140
                                  ) + "..."

                                : ""
                        }

                    </p>

                    <div class="small text-muted mb-2">

                        <i class="bi bi-calendar-event me-2"></i>

                        ${formatDateRange(
                            event.start_date,
                            event.end_date
                        )}

                    </div>

                    <div class="small text-muted mb-2">

                        <i class="bi bi-geo-alt me-2"></i>

                        ${event.venue || ""}

                        ${

                            event.location

                                ? ", " + event.location

                                : ""

                        }

                    </div>

                    <div class="small text-muted mb-4">

                        <i class="bi bi-people me-2"></i>

                        ${slots}

                    </div>

                    ${button}

                </div>

            </div>

        </div>

    `;

}

/* ==========================================================
   Visitor Button
========================================================== */

function buildVisitorButton() {

    return `

        <a
            href="community.html"
            class="btn btn-warning w-100">

            Become a Member

        </a>

    `;

}

/* ==========================================================
   Member Button
========================================================== */

function buildMemberButton(event) {

    if (event.registered) {

        return `

            <button
                class="btn btn-success w-100"
                disabled>

                ✓ Registered

            </button>

        `;

    }

    if (!event.can_register) {

        return `

            <button
                class="btn btn-secondary w-100"
                disabled>

                ${event.registration_message}

            </button>

        `;

    }

    return `

        <button
            class="btn btn-primary w-100 join-event-btn"
            data-event-id="${event.id}">

            Join Event

        </button>

    `;

}

/* ==========================================================
   Register For Event
========================================================== */

async function registerForEvent(eventId) {

    try {

        const response = await fetch(

            `${API_BASE_URL}/member/events/${eventId}/register`,

            {

                method: "POST",

                headers: {

                    Authorization:
                        `Bearer ${getMemberToken()}`,

                    "Content-Type":
                        "application/json"

                }

            }

        );

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(

                result.message ||

                "Registration failed."

            );

        }

        alert(
            "You have successfully registered for the event."
        );

        loadEvents();
    }

    catch (error) {

        alert(error.message);

    }

}

/* ==========================================================
   Unified Event Loader
========================================================== */

function loadEvents() {

    if (isLoggedIn()) {

        loadMemberUpcomingEvents();
        loadMemberFeaturedEvents();

    } else {

        loadUpcomingEvents();
        loadFeaturedEvents();

    }

}

/* ==========================================================
   Load Upcoming Events
========================================================== */

async function loadUpcomingEvents() {

    if (!upcomingContainer) {

        return;

    }

    upcomingContainer.innerHTML =

        `
        <div class="col-12 text-center py-5">

            <div class="spinner-border text-warning"></div>

        </div>
        `;

    try {

        const response = await fetch(

            `${API_BASE_URL}/public/events/upcoming`

        );

        const result =
            await response.json();

        if (

            !result.success ||

            result.data.length === 0

        ) {

            upcomingContainer.innerHTML =

                `
                <div class="col-12 text-center py-5">

                    <h5>

                        No upcoming events.

                    </h5>

                </div>
                `;

            return;

        }

        upcomingContainer.innerHTML =

            result.data

                .map(buildEventCard)

                .join("");

    }

    catch (error) {

        console.error(error);

        upcomingContainer.innerHTML =

            `
            <div class="col-12 text-center py-5">

                Unable to load events.

            </div>
            `;

    }

}

/* ==========================================================
   Load Featured Events
========================================================== */

async function loadFeaturedEvents() {

    if (!signatureContainer) {

        return;

    }

    signatureContainer.innerHTML =

        `
        <div class="col-12 text-center py-5">

            <div class="spinner-border text-warning"></div>

        </div>
        `;

    try {

        const response = await fetch(

            `${API_BASE_URL}/public/events/featured`

        );

        const result =
            await response.json();

        if (

            !result.success ||

            result.data.length === 0

        ) {

            signatureContainer.innerHTML =

                `
                <div class="col-12 text-center py-5">

                    No featured events.

                </div>
                `;

            return;

        }

        signatureContainer.innerHTML =

            result.data

                .map(buildEventCard)

                .join("");

    }

    catch (error) {

        console.error(error);

        signatureContainer.innerHTML =

            `
            <div class="col-12 text-center py-5">

                Unable to load events.

            </div>
            `;

    }

}

/* ==========================================================
   Events
========================================================== */

document.addEventListener(

    "click",

    function (e) {

        if (

            e.target.classList.contains(

                "join-event-btn"

            )

        ) {

            registerForEvent(

                e.target.dataset.eventId

            );

        }

    }

);

/* ==========================================================
   Initialize
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadEvents();
    }

);