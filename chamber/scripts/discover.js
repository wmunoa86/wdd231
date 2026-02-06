import { places } from '../data/places.mjs';

const grid = document.getElementById('discover-grid');
const msgContainer = document.getElementById('visit-message');
const dialog = document.getElementById('place-dialog');
const dialogContent = document.getElementById('place-dialog-content');

// Render Cards
if (grid) {
    places.forEach((place, index) => {
        const card = document.createElement('div');
        card.classList.add('discover-card', `card-${index + 1}`);
        
        const title = document.createElement('h2');
        title.textContent = place.name;
        
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = place.image;
        img.alt = place.name;
        img.loading = 'lazy';
        img.width = 300;
        img.height = 200;
        figure.appendChild(img);
        
        const address = document.createElement('address');
        address.textContent = place.address;
        
        const desc = document.createElement('p');
        desc.textContent = place.description;
        
        const btn = document.createElement('button');
        btn.textContent = 'Learn More';
        btn.classList.add('cta-button');
        btn.addEventListener('click', () => {
            displayModal(place);
        });
        
        card.appendChild(title);
        card.appendChild(figure);
        card.appendChild(address);
        card.appendChild(desc);
        card.appendChild(btn);
        
        grid.appendChild(card);
    });
}

function displayModal(place) {
    if (!dialog || !dialogContent) return;

    dialogContent.innerHTML = `
        <h2>${place.name}</h2>
        <img src="${place.image}" alt="${place.name}" loading="lazy">
        <address>${place.address}</address>
        <p>${place.description}</p>
    `;
    dialog.showModal();
}

// Visit Message Logic
if (msgContainer) {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    
    if (!lastVisit) {
        msgContainer.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const diff = now - parseInt(lastVisit);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days < 1) {
            msgContainer.textContent = "Back so soon! Awesome!";
        } else {
            const dayString = days === 1 ? "day" : "days";
            msgContainer.textContent = `You last visited ${days} ${dayString} ago.`;
        }
    }
    
    localStorage.setItem('lastVisit', now);
}