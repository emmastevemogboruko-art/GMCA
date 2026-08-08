const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserModel = require("../models/userModel");
const UserTokenService = require("./userTokenService");

class UserService {

    /**
     * ==========================================
     * Create User
     * ==========================================
     */
    static async createUser(data, assignedBy = null) {

        const {
            member_id,
            username,
            email,
            password,
            role_id
        } = data;

        // Validate required fields
        if (!username || !email || !password || !role_id) {

            throw new Error(
                "Username, email, password and role are required."
            );

        }

        // Check whether any users already exist
        const totalUsers =
            await UserModel.countUsers();

        // Allow only the very first user
        // to be created without authentication
        if (
            totalUsers > 0 &&
            assignedBy === null
        ) {

            throw new Error(
                "Unauthorized. Only a Super Admin can create users."
            );

        }

        // Check username
        const existingUsername =
            await UserModel.getUserByUsername(
                username
            );

        if (existingUsername) {

            throw new Error(
                "Username already exists."
            );

        }

        // Check email
        const existingEmail =
            await UserModel.getUserByEmail(
                email
            );

        if (existingEmail) {

            throw new Error(
                "Email already exists."
            );

        }

        // Hash password
        const password_hash =
            await bcrypt.hash(
                password,
                10
            );

        // Create user
        const user =
            await UserModel.createUser({

                member_id,

                username,

                email,

                password_hash

            });

        // Assign role
        await UserModel.assignRole(

            user.id,

            role_id,

            assignedBy

        );

        return {

            id: user.id,

            member_id: user.member_id,

            username: user.username,

            email: user.email,

            is_active: user.is_active,

            role_id

        };

    }

    /**
     * ==========================================
     * Automatically Create Member Account
     * ==========================================
     */
    static async createMemberAccount(member, application) {

        if (!member) {

            throw new Error(
                "Member is required."
            );

        }

        if (!application) {

            throw new Error(
                "Application is required."
            );

        }

        // Existing account?
        const existingUser =
            await UserModel.getUserByEmail(
                application.email
            );

        if (existingUser) {

            return {

                user: existingUser,

                activationToken: null,

                activationLink: null

            };

        }

        // Username = Membership Number
        const username =
            member.membership_number;

        // Email from application
        const email =
            application.email;

        /*
        |--------------------------------------------------------------------------
        | Temporary Random Password
        |
        | This password will never be used by the member.
        | It simply satisfies the NOT NULL password_hash
        | requirement until the member activates the account.
        |--------------------------------------------------------------------------
        */

        const placeholderPassword =
            require("crypto")
                .randomBytes(32)
                .toString("hex");

        const password_hash =
            await bcrypt.hash(
                placeholderPassword,
                10
        );

        // Create User
        const user =
            await UserModel.createUser({

                member_id: member.id,

                username,

                email,

                password_hash

            });

        // Assign Member Role
        await UserModel.assignRole(

            user.id,

            6,

            null

        );

        // Create Activation Token
        const activation =
            await UserTokenService.createActivationToken(
                user.id
            );

        const activationLink =
            UserTokenService.getActivationLink(
                activation.token
            );

        return {

            user,

            activationToken:
                activation.token,

            activationLink

        };

    }

    /**
     * ==========================================
     * Get All Users
     * ==========================================
     */
    static async getAllUsers() {

        return await UserModel.getAllUsers();

    }

    /**
     * ==========================================
     * Get User By ID
     * ==========================================
     */
    static async getUser(id) {

        const user =
            await UserModel.getUserById(id);

        if (!user) {

            throw new Error(
                "User not found."
            );

        }

        return user;

    }

    /**
     * ==========================================
     * Activate / Deactivate User
     * ==========================================
     */
    static async updateStatus(
        id,
        is_active
    ) {

        const user =
            await UserModel.getUserById(id);

        if (!user) {

            throw new Error(
                "User not found."
            );

        }

        await UserModel.updateStatus(
            id,
            is_active
        );

        return {

            message:
                `User ${is_active ? "activated" : "deactivated"} successfully.`

        };

    }

    /**
     * ==========================================
     * Reset Password (Admin)
     * ==========================================
     */
    static async resetPassword(
        id,
        password
    ) {

        if (!password) {

            throw new Error(
                "Password is required."
            );

        }

        const user =
            await UserModel.getUserById(id);

        if (!user) {

            throw new Error(
                "User not found."
            );

        }

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );

        await UserModel.updatePassword(

            id,

            passwordHash

        );

        return {

            message:
                "Password updated successfully."

        };

    }

    /**
     * ==========================================
     * Change Own Password
     * ==========================================
     */
    static async changePassword(

        userId,

        currentPassword,

        newPassword,

        confirmPassword

    ) {

        if (

            !currentPassword ||

            !newPassword ||

            !confirmPassword

        ) {

            throw new Error(

                "Current password, new password and confirmation are required."

            );

        }

        if (

            newPassword !== confirmPassword

        ) {

            throw new Error(

                "New password and confirmation do not match."

            );

        }

        const user =
            await UserModel.getPasswordHash(
                userId
            );

        if (!user) {

            throw new Error(
                "User not found."
            );

        }

        const validPassword =
            await bcrypt.compare(

                currentPassword,

                user.password_hash

            );

        if (!validPassword) {

            throw new Error(

                "Current password is incorrect."

            );

        }

        const passwordHash =
            await bcrypt.hash(

                newPassword,

                10

            );

        await UserModel.updatePassword(

            userId,

            passwordHash

        );

        return {

            message:
                "Password changed successfully."

        };

    }

}

module.exports = UserService;