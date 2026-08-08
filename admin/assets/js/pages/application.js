import { api } from '../core/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const applicationId = new URLSearchParams(window.location.search).get("id");

    const loading = document.getElementById("loading");
    const content = document.getElementById("application-content");
    const details = document.getElementById("application-details");

    const statusSelect = document.getElementById("status");
    const notesInput = document.getElementById("admin_notes");
    const saveBtn = document.getElementById("save-btn");

    let application = null;

    async function loadApplication() {
        try {
            const response = await api.get(`/applications/${applicationId}`);
            application = response.application;
            if (loading) loading.style.display = "none";
            if (content) content.style.display = "block";
            renderApplication();
        } catch (error) {
            console.error(error);
            if (loading) loading.innerHTML = "Failed to load application.";
        }
    }

    function renderApplication() {
        if (!details || !application) return;
        details.innerHTML = `\n
        <div class="card">\n\n+            <h2>👤 Personal Information</h2>\n\n+            <p><strong>Reference:</strong> ${application.application_reference}</p>\n+            <p><strong>Full Name:</strong> ${application.full_name}</p>\n+            <p><strong>Stage Name:</strong> ${application.stage_name || "-"}</p>\n+            <p><strong>Gender:</strong> ${application.gender}</p>\n+            <p><strong>Date of Birth:</strong> ${new Date(application.dob).toLocaleDateString()}</p>\n+            <p><strong>Email:</strong> ${application.email}</p>\n+            <p><strong>Phone:</strong> ${application.phone}</p>\n+            <p><strong>Country:</strong> ${application.country}</p>\n+            <p><strong>City:</strong> ${application.city}</p>\n+\n+        </div>\n\n+        <br>\n\n+        <div class="card">\n\n+            <h2>🎤 Ministry Information</h2>\n\n+            <p><strong>Ministry Name:</strong> ${application.ministry_name}</p>\n+            <p><strong>Primary Role:</strong> ${application.primary_role}</p>\n+            <p><strong>Category:</strong> ${application.category}</p>\n+            <p><strong>Years in Ministry:</strong> ${application.years_in_ministry}</p>\n+            <p><strong>Church:</strong> ${application.church}</p>\n+            <p><strong>Pastor:</strong> ${application.pastor}</p>\n\n+        </div>\n\n+        <br>\n\n+        <div class="card">\n\n+            <h2>📖 Ministry Profile</h2>\n\n+            <p><strong>Story</strong></p>\n+            <p>${application.story || "-"}</p>\n+\n+            <p><strong>Vision</strong></p>\n+            <p>${application.vision || "-"}</p>\n+\n+            <p><strong>Challenges</strong></p>\n+            <p>${application.challenge || "-"}</p>\n+\n+            <p><strong>Why Join GMCA?</strong></p>\n+            <p>${application.why_join || "-"}</p>\n\n+        </div>\n\n+        <br>\n\n+        <div class="card">\n\n+            <h2>🌐 Social Media</h2>\n\n+            <p><strong>Facebook:</strong> ${application.facebook || "-"}</p>\n+            <p><strong>Instagram:</strong> ${application.instagram || "-"}</p>\n+            <p><strong>YouTube:</strong> ${application.youtube || "-"}</p>\n+            <p><strong>TikTok:</strong> ${application.tiktok || "-"}</p>\n+            <p><strong>Website:</strong> ${application.website || "-"}</p>\n\n+        </div>\n\n+        <br>\n\n+        <div class="card">\n\n+            <h2>❤️ Interests</h2>\n\n+            <p><strong>Volunteer:</strong> ${application.volunteer ? "Yes" : "No"}</p>\n+\n+            <p><strong>Interests:</strong></p>\n+\n+            <p>\n+                ${application.interests?.length ? application.interests.join(", ") : "-"}\n+            </p>\n\n+        </div>\n\n+        <br>\n\n+        <div class="card">\n\n+            <h2>📝 Review Information</h2>\n\n+            <p><strong>Status:</strong> ${application.status}</p>\n\n+            <p><strong>Reviewed At:</strong>\n+                ${application.reviewed_at ? new Date(application.reviewed_at).toLocaleString() : "-"}\n+            </p>\n\n+            <p><strong>Admin Notes:</strong></p>\n\n+            <p>${application.admin_notes || "-"}</p>\n\n+        </div>\n\n+    `;

        if (statusSelect) statusSelect.value = application.status;
        if (notesInput) notesInput.value = application.admin_notes || "";
    }

    loadApplication();

});
