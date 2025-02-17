document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }
});
    
// Update Footer Year and Last Modified Date
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;
 
// Booking Form Submission
const bookingForm = document.querySelector(".booking-form form");
if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        // Collect form data
        const bookingData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            tour: document.getElementById("tour").value,
            date: document.getElementById("date").value,
            people: document.getElementById("people").value,
            message: document.getElementById("message").value,
        };
        
        // Store data in sessionStorage
        sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
        
        // Redirect to confirmation page
        window.location.href = "confirm_page.html";
    });
};