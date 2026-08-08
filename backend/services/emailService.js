/**
 * ==========================================================
 * GMCA Membership System
 * Email Service
 * File: services/emailService.js
 * ==========================================================
 */

"use strict";

const nodemailer = require("nodemailer");

/**
 * ==========================================================
 * Email Transport
 * ==========================================================
 */

const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT),

    secure: process.env.SMTP_SECURE === "true",

    auth: {

        user: process.env.SMTP_USER,

        pass: process.env.SMTP_PASS

    }

});

/**
 * ==========================================================
 * Verify SMTP Connection
 * ==========================================================
 */

async function verifyConnection() {

    try {

        await transporter.verify();

        console.log(
            "✓ Email Service Connected"
        );

    }

    catch (error) {

        console.error(
            "✗ Email Service Connection Failed"
        );

        console.error(
            error.message
        );

    }

}

/**
 * ==========================================================
 * Generic Send Email
 * ==========================================================
 */

async function send({

    to,

    subject,

    text,

    html

}) {

    try {

        const info =
            await transporter.sendMail({

                from:
                    `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,

                to,

                subject,

                text,

                html

            });

        console.log(

            `✓ Email sent: ${info.messageId}`

        );

        return info;

    }

    catch (error) {

        console.error(

            "Failed to send email."

        );

        throw error;

    }

}

/**
 * ==========================================================
 * Application Received Email
 * ==========================================================
 */

async function sendApplicationReceivedEmail(
    application
) {

    return await send({

        to: application.email,

        subject:
            "Application Received - Gospel Music Community Africa",

        text:
`Dear ${application.first_name},

Thank you for applying to become a member of Gospel Music Community Africa (GMCA).

We have successfully received your application.

Application Number:
${application.application_number}

Our Membership Committee will review your application and contact you once the review process is complete.

Thank you for your interest in joining Gospel Music Community Africa.

Kind regards,

GMCA Membership Team`,

        html:
`
<p>Dear <strong>${application.first_name}</strong>,</p>

<p>
Thank you for applying to become a member of
<strong>Gospel Music Community Africa (GMCA)</strong>.
</p>

<p>
We have successfully received your application.
</p>

<p>

<strong>Application Number</strong><br>

${application.application_number}

</p>

<p>
Our Membership Committee will review your application and contact you once the review process is complete.
</p>

<p>
Thank you for your interest in joining
<strong>Gospel Music Community Africa (GMCA)</strong>.
</p>

<p>
Kind regards,<br>

<strong>GMCA Membership Team</strong>
</p>
`

    });

}

/**
 * ==========================================================
 * Member Approval Email
 * ==========================================================
 */

async function sendMemberApprovalEmail(
    application,
    account
) {

    return await send({

        to: application.email,

        subject:
            "Welcome to Gospel Music Community Africa",

        text:
`Dear ${application.first_name},

Congratulations!

Your membership application has been approved.

Your member account has been created successfully.

Username:
${account.user.username}

Please use the link below to activate your account and create your password.

${account.activationLink}

This activation link will expire in 24 hours.

If you did not request this account, please contact Gospel Music Community Africa immediately.

Welcome to the GMCA family!

Kind regards,

GMCA Membership Team`,

        html:
`
<div style="
max-width:700px;
margin:auto;
font-family:Arial, Helvetica, sans-serif;
color:#333333;
line-height:1.6;
">

<h2 style="
color:#198754;
margin-bottom:10px;
">

Welcome to Gospel Music Community Africa

</h2>

<p>

Dear <strong>${application.first_name}</strong>,

</p>

<p>

Congratulations!

Your membership application has been
<strong>approved</strong>.

</p>

<p>

Your member account has been created successfully.

</p>

<p>

<strong>Username</strong><br>

${account.user.username}

</p>

<p>

Click the button below to activate your account and create your password.

</p>

<p style="margin:35px 0;">

<a
href="${account.activationLink}"
style="
background:#198754;
color:#ffffff;
padding:14px 30px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
display:inline-block;
">

Set My Password

</a>

</p>

<p>

If the button above does not work,
copy and paste the following link into your browser.

</p>

<p style="
word-break:break-all;
color:#198754;
">

${account.activationLink}

</p>

<p>

<strong>

This activation link expires in
24 hours.

</strong>

</p>

<p>

If you did not request this account,
please contact Gospel Music Community Africa immediately.

</p>

<hr style="
margin:40px 0;
border:none;
border-top:1px solid #dddddd;
">

<p style="
font-size:14px;
color:#666666;
">

Thank you for becoming part of
<strong>Gospel Music Community Africa (GMCA)</strong>.

We look forward to serving and growing together with you.

</p>

<p>

Kind regards,<br>

<strong>GMCA Membership Team</strong>

</p>

</div>
`

    });

}

/**
 * ==========================================================
 * Password Reset Email
 * ==========================================================
 */

async function sendPasswordResetEmail(
    user,
    resetLink
) {

    return await send({

        to: user.email,

        subject:
            "Reset Your Gospel Music Community Africa Password",

        text:
`Dear ${user.username},

We received a request to reset your password.

Please use the link below to create a new password.

${resetLink}

This password reset link will expire in 24 hours.

If you did not request a password reset, you can safely ignore this email.

Kind regards,

GMCA Membership Team`,

        html:
`
<div style="
max-width:700px;
margin:auto;
font-family:Arial, Helvetica, sans-serif;
color:#333333;
line-height:1.6;
">

<h2 style="color:#198754;">

Reset Your Password

</h2>

<p>

Dear <strong>${user.username}</strong>,

</p>

<p>

We received a request to reset your password.

</p>

<p>

Click the button below to create a new password.

</p>

<p style="margin:35px 0;">

<a
href="${resetLink}"
style="
background:#198754;
color:#ffffff;
padding:14px 30px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
display:inline-block;
">

Reset Password

</a>

</p>

<p>

If the button above does not work, copy and paste this link into your browser.

</p>

<p style="
word-break:break-all;
color:#198754;
">

${resetLink}

</p>

<p>

<strong>

This link expires in 24 hours.

</strong>

</p>

<p>

If you did not request a password reset, you may safely ignore this email.

</p>

<hr style="
margin:40px 0;
border:none;
border-top:1px solid #dddddd;
">

<p style="
font-size:14px;
color:#666666;
">

Gospel Music Community Africa (GMCA)

</p>

</div>
`

    });

}

/**
 * ==========================================================
 * Exports
 * ==========================================================
 */

module.exports = {

    verifyConnection,

    send,

    sendApplicationReceivedEmail,

    sendMemberApprovalEmail,

    sendPasswordResetEmail

};