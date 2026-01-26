document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('site-nav');

  // Populate the current year in footer
  const yearEl = document.querySelector('.year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Populate Last Modified in "MonthName DD, YYYY hh:mm AM/PM" format
  const lastEl = document.querySelector('.last-modified');
  if (lastEl) {
    let lm = document.lastModified;
    let d = lm ? new Date(lm) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    const pad = n => String(n).padStart(2, '0');
    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    const monthName = monthNames[d.getMonth()];
    const dd = pad(d.getDate());
    const yyyy = d.getFullYear();
    const hours24 = d.getHours();
    const hours12 = pad(hours24 % 12 === 0 ? 12 : hours24 % 12);
    const min = pad(d.getMinutes());
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    lastEl.textContent = `Last Modified: ${monthName} ${dd}, ${yyyy} ${hours12}:${min} ${ampm}`;
  }

  // Only add toggle behavior if both elements are present
  if (btn && nav) {
    btn.addEventListener('click', function () {
      const open = btn.classList.toggle('open');
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
  }

  // --- Courses rendering & filtering ---
  const coursesListEl = document.getElementById('courses-list');
  const filterButtons = Array.from(document.querySelectorAll('.course-filter'));

  function createCourseCard(c) {
    const statusClass = c.completed ? 'completed' : 'not-completed';
    return `
      <article class="course-card ${statusClass}" aria-label="${c.subject} ${c.number} ${c.title}">
        <div class="course-title">${c.subject} ${c.number}: ${c.title}</div>
      </article>
    `;
  }

  function renderCourses(list) {
    if (!coursesListEl) return;

    // update total credits based on the list being rendered
    const totalEl = document.querySelector('.total-credits');
    const total = Array.isArray(list) ? list.reduce((s, c) => s + (Number(c.credits) || 0), 0) : 0;
    if (totalEl) totalEl.textContent = total;

    if (!list || list.length === 0) {
      coursesListEl.innerHTML = '<p>No courses to display.</p>';
      return;
    }
    coursesListEl.innerHTML = list.map(createCourseCard).join('');
  }

  function applyFilter(filter) {
    if (!Array.isArray(courses)) return;
    let result;
    if (filter === 'All') result = courses.slice();
    else result = courses.filter(c => c.subject === filter);
    renderCourses(result);
  }

  // Wire up filter buttons
  filterButtons.forEach(btnEl => {
    btnEl.addEventListener('click', function () {
      filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      this.setAttribute('aria-pressed', 'true');
      const f = this.dataset.filter;
      applyFilter(f);
    });
  });

  // Initial render: All
  applyFilter('All');

  // --- Modal Logic ---
  const courseDetailsDialog = document.getElementById('course-details');

  function displayCourseDetails(course) {
    if (!courseDetailsDialog) return;

    courseDetailsDialog.innerHTML = `
      <button id="close-modal">❌</button>
      <h2>${course.subject} ${course.number}</h2>
      <h3>${course.title}</h3>
      <p><strong>Credits</strong>: ${course.credits}</p>
      <p><strong>Certificate</strong>: ${course.certificate}</p>
      <p>${course.description}</p>
      <p><strong>Technologies</strong>: ${course.technology.join(', ')}</p>
    `;
    
    courseDetailsDialog.showModal();

    // Close on click of the X button
    const closeBtn = document.getElementById('close-modal');
    closeBtn.addEventListener('click', () => {
      courseDetailsDialog.close();
    });

    // Optional: Close when clicking outside the modal content
    courseDetailsDialog.addEventListener('click', (e) => {
        if (e.target === courseDetailsDialog) {
            courseDetailsDialog.close();
        }
    });
  }

  // Event delegation to listener for course card clicks
  if (coursesListEl) {
    coursesListEl.addEventListener('click', (e) => {
      // Traverse up to find the card
      const card = e.target.closest('.course-card');
      if (card) {
        // Find the course object from the courses array
        // We can parse subject/number from the text or add data attributes.
        // Let's rely on finding it in the array. 
        // A safer way is ensuring we match the correct one.
        // Let's assume the text content "SUBJECT NUMBER" is reliable or better, look at how we created it.
        // createCourseCard used: ${c.subject} ${c.number} inside .course-title
        
        // Easier: let's re-find based on content.
        // Or better, let's look at the aria-label or title text.
        // In createCourseCard: <article ... aria-label="${c.subject} ${c.number} ${c.title}">
        
        // Let's parse the subject and number from the card's text or aria label?
        // Actually, since we have the `courses` array in scope (from global `course_list_array.js`), 
        // we can search it.
        
        // Let's extract Subject and Number from the .course-title div
        // Format: "CSE 110: Introduction to Programming"
        const titleText = card.querySelector('.course-title').textContent; 
        // titleText matches: `${c.subject} ${c.number}: ${c.title}`
        
        // We can split by ':' to get "Subject Number"
        const [courseCode] = titleText.split(':'); // "CSE 110"
        const [subject, numberStr] = courseCode.split(' ');
        const number = parseInt(numberStr, 10);

        const course = courses.find(c => c.subject === subject && c.number === number);
        if (course) {
          displayCourseDetails(course);
        }
      }
    });
  }
});