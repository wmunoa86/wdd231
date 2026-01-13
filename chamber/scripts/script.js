document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('site-nav');
  
  // Only add toggle behavior if both elements are present
  if (btn && nav) {
    btn.addEventListener('click', function () {
      const open = btn.classList.toggle('open');
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
  }

  const yearEl = document.querySelector('.year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

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
});

const url = "data/members.json";

const cards = document.querySelector("#cards");

async function getMemberData() {
    const response = await fetch(url);
    const data = await response.json();
    displayMembers(data.members);
}

getMemberData();

const displayMembers = (members) => {
    members.forEach((member) => {
        let card = document.createElement("section");
        let fullName = document.createElement("h2");
        let phoneNumber = document.createElement("p");
        let website = document.createElement("p");
        let memberLevel = document.createElement("p");
        let memberSince = document.createElement("p");
        let portrait = document.createElement("img");

        fullName.textContent = `${member.company}`;
        phoneNumber.textContent = `Phone: ${member.phone_number}`;
        website.textContent = `${member.website}`;
        memberLevel.textContent = `Member Level: ${member.membership_level}`;
        memberSince.textContent = `Member Since: ${member.member_since}`;

        portrait.setAttribute("src", member.image);
        portrait.setAttribute("alt", `Portrait of ${member.company}`);
        portrait.setAttribute("loading", "lazy");
        portrait.setAttribute("width", "250");
        portrait.setAttribute("height", "auto");

        card.appendChild(fullName);
        card.appendChild(phoneNumber);
        card.appendChild(website);
        card.appendChild(memberLevel);
        card.appendChild(memberSince);

        card.appendChild(portrait);
        
        cards.appendChild(card);
    })
}