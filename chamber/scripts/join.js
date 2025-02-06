// Hamburger menu functionality
const hamburgerButton = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburgerButton.addEventListener('click', () => {
    const isVisible = navMenu.style.display === 'block';
    navMenu.style.display = isVisible ? 'none' : 'block';
    hamburgerButton.textContent = isVisible ? '\u2630' : 'X'; // Change symbol between menu and close
});

// Update the year dynamically in the footer
const yearSpan = document.getElementById('year');
const lastModifiedSpan = document.getElementById('lastModified');

const currentYear = new Date().getFullYear();
const lastModified = document.lastModified;

yearSpan.textContent = currentYear;
lastModifiedSpan.textContent = lastModified;

document.addEventListener("DOMContentLoaded", function () {
    const modals = document.querySelectorAll(".modal");
    const cardLinks = document.querySelectorAll(".card a");
    const closeButtons = document.querySelectorAll(".close");

    // Ensure all modals are hidden at the start
    modals.forEach(modal => {
        modal.style.display = "none";
    });

    // Open modal when clicking on card links
    cardLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            const modalId = this.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = "flex";
            }
        });
    });

    // Close modal when clicking on close button
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            this.closest(".modal").style.display = "none";
        });
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", function (event) {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });
});



