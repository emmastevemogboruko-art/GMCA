document.addEventListener('DOMContentLoaded', async () => {
  if (!window.GMCA_AUTH.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('id');
  const details = document.getElementById('event-details');

  if (!eventId || !details) return;

  try {
    const response = await window.GMCA_API.request(`/events/${eventId}`);
    details.innerHTML = `<strong>${response?.title || 'Event'}</strong><br />${response?.description || 'More details coming soon.'}`;
  } catch (error) {
    details.textContent = error.message || 'Unable to load event details';
  }
});
