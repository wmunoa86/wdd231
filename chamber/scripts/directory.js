const mainnav = document.querySelector('.navigation');
const hambutton = document.querySelector('#menu');

// Add a click event listender to the hamburger button and use a callback function that toggles the list element's list of classes.
hambutton.addEventListener('click', () => {
	mainnav.classList.toggle('show');
	hambutton.classList.toggle('show');
});

document.addEventListener('DOMContentLoaded', async () => {
    const membersData = await fetchMembers();
    renderMembers(membersData);

    document.getElementById('grid-view').addEventListener('click', () => {
        toggleView('grid');
    });
    
    document.getElementById('list-view').addEventListener('click', () => {
        toggleView('list');
    });

    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;

});

async function fetchMembers() {
    const response = await fetch('scripts/members.json');
    return await response.json();
}

function renderMembers(members) {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = ''; // Clear any existing content
    
    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.classList.add('member-card');
        memberCard.innerHTML = `
            <img src="images/${member.image}" alt="${member.name}">
            <h2>${member.name}</h2>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank">Visit Website</a>
        `;
        membersList.appendChild(memberCard);
    });
}

function toggleView(view) {
    const membersList = document.getElementById('members-list');
    if (view === 'grid') {
        membersList.classList.add('grid-view');
        membersList.classList.remove('list-view');
    } else {
        membersList.classList.add('list-view');
        membersList.classList.remove('grid-view');
    }
}


