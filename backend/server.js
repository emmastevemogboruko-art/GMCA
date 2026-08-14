/**
 * ==========================================================
 * GMCA Membership Portal API
 * Server Entry Point
 * File: server.js
 * ==========================================================
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./config/db");
const EmailService = require("./services/emailService");

// Routes
const applicationRoutes = require("./routes/applications");
const memberRoutes = require("./routes/memberRoutes");
const dashboardRoutes = require("./routes/dashboard");
const eventRoutes = require("./routes/eventRoutes");
const publicEventRoutes = require("./routes/publicEventRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const memberPortalRoutes = require("./routes/memberPortalRoutes");
const memberCategoryRoutes = require("./routes/memberCategoryRoutes");

/* ==========================================
   Donations
========================================== */

const donationRoutes = require("./routes/donationRoutes");

const app = express();

/* ==========================================================
   Middleware
========================================================== */

app.use(cors());
app.use(express.json());

/* ==========================================================
   Home Route
========================================================== */

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "GMCA Membership API is running."
    });

});

/* ==========================================================
   Database Connection Test
========================================================== */

app.get("/test-db", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT NOW()"
        );

        res.status(200).json({

            success: true,

            database: "Connected",

            time: result.rows[0].now

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            database: "Disconnected",

            error: error.message

        });

    }

});

/* ==========================================================
   API Routes
========================================================== */

app.use(
    "/api/applications",
    applicationRoutes
);

app.use(
    "/api/members",
    memberRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/events",
    eventRoutes
);

/*
|--------------------------------------------------------------------------
| Public Events API
|--------------------------------------------------------------------------
*/

app.use(
    "/api/public/events",
    publicEventRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/profile",
    profileRoutes
);

app.use(
    "/api/member-categories",
    memberCategoryRoutes
);

/*
|--------------------------------------------------------------------------
| Donations API
|--------------------------------------------------------------------------
*/

app.use(
    "/api/donations",
    donationRoutes
);

/*
|--------------------------------------------------------------------------
| Member Portal
|--------------------------------------------------------------------------
*/

app.use(
    "/api/member",
    memberPortalRoutes
);

/* ==========================================================
   Frontend Static Files
========================================================== */

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

/* ==========================================================
   404 Handler
========================================================== */

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found."

    });

});

/* ==========================================================
   Global Error Handler
========================================================== */

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,

        message: "Internal Server Error",

        error: err.message

    });

});

/* ==========================================================
   Start Server
========================================================== */

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {

    console.log("======================================");
    console.log(" GMCA Membership API");
    console.log("======================================");

    /*
    |----------------------------------------------------------
    | Verify Database Connection
    |----------------------------------------------------------
    */

    try {

        await pool.query("SELECT NOW()");

        console.log("✓ Database Connected");

    }

    catch (error) {

        console.error("✗ Database Connection Failed");
        console.error(error.message);

    }

    /*
    |----------------------------------------------------------
    | Verify Email Service
    |----------------------------------------------------------
    */

    await EmailService.verifyConnection();

    console.log(
        ` Server Running : http://localhost:${PORT}`
    );

    console.log(
        ` Environment    : ${
            process.env.NODE_ENV || "development"
        }`
    );

    console.log("======================================");

});