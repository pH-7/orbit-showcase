const availability = document.querySelector('#availability');
const downlink = document.querySelector('#downlink');
const contact = document.querySelector('#contact');

async function updateTelemetry() {
  try {
    const response = await fetch('/api/telemetry');
    if (!response.ok) return;

    const data = await response.json();
    if (availability) availability.textContent = data.availability;
    if (downlink) downlink.textContent = `${data.downlinkTerabytes} TB`;
    if (contact) {
      contact.textContent = `${String(data.nextContactMinutes).padStart(2, '0')}:${String(data.nextContactSeconds).padStart(2, '0')}`;
    }
  } catch {
    // The server-rendered values remain available when live telemetry is offline.
  }
}

updateTelemetry();
setInterval(updateTelemetry, 10000);
