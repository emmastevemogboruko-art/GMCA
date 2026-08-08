"use strict";

const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function createTestMember() {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Check if user already exists
        const existing = await client.query(
            `
            SELECT id
            FROM users
            WHERE username = $1
               OR email = $2
            `,
            [
                "testmember",
                "member@gmca.test"
            ]
        );

        if (existing.rows.length) {

            console.log("✓ Test member already exists.");

            await client.query("ROLLBACK");

            return;

        }

        const passwordHash = await bcrypt.hash(

            "Password123!",

            10

        );

        // Create user
        const user = await client.query(
            `
            INSERT INTO users
            (
                member_id,
                username,
                email,
                password_hash,
                is_active
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                TRUE
            )
            RETURNING id;
            `,
            [
                1,
                "testmember",
                "member@gmca.test",
                passwordHash
            ]
        );

        const userId = user.rows[0].id;

        // Assign Member role
        await client.query(
            `
            INSERT INTO user_roles
            (
                user_id,
                role_id
            )
            VALUES
            (
                $1,
                6
            );
            `,
            [userId]
        );

        await client.query("COMMIT");

        console.log("");
        console.log("======================================");
        console.log(" Test Member Created");
        console.log("======================================");
        console.log("Username : testmember");
        console.log("Password : Password123!");
        console.log("======================================");
        console.log("");

    }

    catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

    }

    finally {

        client.release();

        process.exit();

    }

}

createTestMember();