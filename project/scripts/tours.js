document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }
    
    // Update Footer Year and Last Modified Date
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;

    // Smooth Scroll for Tour Booking Buttons
    const bookButtons = document.querySelectorAll(".tour .btn");
    bookButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            alert("Booking feature coming soon!");
        });
    });
});
