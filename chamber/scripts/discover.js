document.addEventListener("DOMContentLoaded", function () {
    const visitMessage = document.getElementById("visit-message");

    // Get last visit from localStorage
    const lastVisit = localStorage.getItem("lastVisit");
    const currentVisit = Date.now();

    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const daysBetween = Math.floor((currentVisit - lastVisit) / (1000 * 60 * 60 * 24));

        visitMessage.textContent = daysBetween < 1 
            ? "Back so soon! Awesome!" 
            : `You last visited ${daysBetween} ${daysBetween === 1 ? "day" : "days"} ago.`;
    }

    localStorage.setItem("lastVisit", currentVisit);

    // Navigation Menu
    const hamburgerButton = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburgerButton.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('lastModified').textContent = document.lastModified;
});