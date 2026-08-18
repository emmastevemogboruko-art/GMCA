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
   Authentication
========================================================== */

/**
 * Use the central GMCA public-site authentication system.
 *
 * SiteAuth is responsible for checking whether a valid
 * member session exists.
 */

function isLoggedIn() {

    return (
        typeof SiteAuth !== "undefined" &&
        SiteAuth.isAuthenticated
    );

}


function getMemberToken() {

    if (
        typeof SiteAuth !== "undefined" &&
        SiteAuth.token
    ) {

        return SiteAuth.token;

    }

    return localStorage.getItem(
        "gmca_member_token"
    );

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
            ${event.registration_message || "Registration Open"}
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
        event.remaining_capacity === null ||
        event.remaining_capacity === undefined

            ? "Unlimited"

            : `${event.remaining_capacity} Places Left`;


    return `

        <div class="col-lg-4 col-md-6">

            <div class="event-card h-100">

                <div class="event-image">

                    <img
                        src="${
                            event.banner_image ||
                            "assets/images/events/event-6.jpg"
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

    /*
     * If the backend tells us that this member has already
     * registered, show Registered.
     */

    if (event.registered) {

        return `

            <button
                class="btn btn-success w-100"
                disabled>

                ✓ Registered

            </button>

        `;

    }


    /*
     * If registration is not currently available,
     * show the backend's registration message.
     */

    if (event.can_register === false) {

        return `

            <button
                class="btn btn-secondary w-100"
                disabled>

                ${event.registration_message || "Registration unavailable"}

            </button>

        `;

    }


    /*
     * Logged-in member who can register.
     */

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

async function registerForEvent(eventId, button) {

    const token = getMemberToken();


    if (!token) {

        alert(
            "Please log in to your GMCA member account first."
        );

        return;

    }


    /*
     * Prevent duplicate clicks.
     */

    if (button) {

        button.disabled = true;

        button.textContent = "Joining...";

    }


    try {

        const response = await fetch(

            `${API_BASE_URL}/member/events/${eventId}/register`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`

                }

            }

        );


        const result =
            await response.json();


        /*
         * If the token has expired, clear the public
         * authentication session and send the member
         * back through the normal login flow.
         */

        if (response.status === 401) {

            if (
                typeof SiteAuth !== "undefined"
            ) {

                SiteAuth.logout();

                return;

            }

            throw new Error(
                "Your session has expired. Please log in again."
            );

        }


        if (!response.ok) {

            throw new Error(

                result.message ||

                "Unable to register for this event."

            );

        }


        /*
         * Registration succeeded.
         */

        if (button) {

            button.classList.remove(
                "btn-primary"
            );

            button.classList.add(
                "btn-success"
            );

            button.textContent =
                "✓ Registered";

        }


        alert(
            result.message ||
            "You have successfully registered for the event."
        );


    }

    catch (error) {

        console.error(
            "Event registration error:",
            error
        );


        if (button) {

            button.disabled = false;

            button.textContent =
                "Join Event";

        }


        alert(
            error.message ||
            "Unable to register for this event."
        );

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

            !result.data ||

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

        console.error(
            "Upcoming events error:",
            error
        );


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

            !result.data ||

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

        console.error(
            "Featured events error:",
            error
        );


        signatureContainer.innerHTML =

            `
            <div class="col-12 text-center py-5">

                Unable to load events.

            </div>
            `;

    }

}


/* ==========================================================
   Load All Events
========================================================== */

async function loadEvents() {

    /*
     * We deliberately use the PUBLIC event endpoints for
     * displaying the events.
     *
     * Authentication only changes the action button.
     *
     * This means guests can still browse events normally.
     */

    await Promise.all([

        loadUpcomingEvents(),

        loadFeaturedEvents()

    ]);

}


/* ==========================================================
   Event Button Click
========================================================== */

document.addEventListener(

    "click",

    function (event) {

        const button =
            event.target.closest(
                ".join-event-btn"
            );


        if (!button) {

            return;

        }


        const eventId =
            button.dataset.eventId;


        if (!eventId) {

            return;

        }


        registerForEvent(
            eventId,
            button
        );

    }

);


/* ==========================================================
   Initialize
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async function () {

        /*
         * IMPORTANT:
         *
         * events.js is loaded before site-auth.js in
         * events.html, so we wait until DOMContentLoaded.
         *
         * By then SiteAuth has been loaded and can validate
         * the existing member session.
         */

        if (
            typeof SiteAuth !== "undefined"
        ) {

            try {

                await SiteAuth.initialize();

            }

            catch (error) {

                console.error(
                    "Unable to initialize site authentication:",
                    error
                );

            }

        }


        /*
         * Now that authentication state has been determined,
         * render the event cards.
         */

        loadEvents();

    }

);