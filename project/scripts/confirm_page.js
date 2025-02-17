document.addEventListener("DOMContentLoaded", () => {
    // Retrieve booking data from session storage
    const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
    
    if (bookingData) {
        document.getElementById("confirm-name").textContent = bookingData.name || "N/A";
        document.getElementById("confirm-email").textContent = bookingData.email || "N/A";
        document.getElementById("confirm-phone").textContent = bookingData.phone || "N/A";
        document.getElementById("confirm-tour").textContent = bookingData.tour || "N/A";
        document.getElementById("confirm-date").textContent = bookingData.date || "N/A";
        document.getElementById("confirm-people").textContent = bookingData.people || "N/A";
        document.getElementById("confirm-message").textContent = bookingData.message || "No additional requests.";
    } else {
        document.querySelector(".confirmation-details").innerHTML = "<p>No booking details found.</p>";
    }

    // Update footer year and last modified date
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;
});

// Navigation Menu
const hamburgerButton = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburgerButton.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;