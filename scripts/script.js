import { courses } from "./courses.js";

const mainnav = document.querySelector('.navigation');
const hambutton = document.querySelector('#menu');
const currentYear = document.querySelector("#currentyear");
const getModification = document.querySelector("#lastModified");

const courseListElement = document.getElementById("course-list");
const totalCreditsElement = document.getElementById("total-credits");

// Add a click event listender to the hamburger button and use a callback function that toggles the list element's list of classes.
hambutton.addEventListener('click', () => {
	mainnav.classList.toggle('show');
	hambutton.classList.toggle('show');
});

//Format Date and Time
function formatDate(date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    
    return `${mm}/${dd}/${yyyy} ${hh}:${min}:${ss}`;
};

let lastModification = new Date(document.lastModified);
const today = new Date();

const formattedDate = formatDate(lastModification);

currentYear.innerHTML = `${today.getFullYear()}`;
getModification.innerHTML = `Last Modification: ${formattedDate}`;

function displayCourses() {
  courseListElement.innerHTML = "";

  courses.forEach(course => {
    const courseCard = document.createElement("div");
    courseCard.classList.add("course-card");
    courseCard.classList.add(course.completed ? "completed" : "incomplete");
    courseCard.dataset.subject = course.subject; 

    courseCard.innerHTML = `
      <h2>${course.subject} ${course.number}</h2>  
    `;
    courseListElement.appendChild(courseCard);
  });
}

function filterCourses(filter) {
  const courseCards = document.querySelectorAll(".course-card");

  courseCards.forEach(card => {
    const subject = card.dataset.subject;

    if (filter === "all" || subject === filter) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  const filteredCourses =
    filter === "all"
      ? courses
      : courses.filter(course => course.subject === filter);

  const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
  totalCreditsElement.textContent = totalCredits;
}

window.filterCourses = filterCourses;
window.displayCourses = displayCourses;

displayCourses();
filterCourses("all");