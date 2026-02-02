document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.querySelector('nav ul');

    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        hamburgerBtn.classList.toggle('active');
    });

    // Display Guitars on Index Page
    const guitarList = document.getElementById('guitar-list');
    
    if (guitarList) {
        // Use relative path 'data/guitars.json' which works when serving from 'project/' root
        fetch('data/guitars.json')
            .then(response => {
                if (!response.ok) {
                    // Fallback for cases where the script might be running from a different context
                    // e.g. if the root is the parent of project/
                    return fetch('project/data/guitars.json');
                }
                return response;
            })
            .then(response => response.json())
            .then(data => {
                // Shuffle array
                const shuffled = data.sort(() => 0.5 - Math.random());
                // Get first 3
                const selected = shuffled.slice(0, 3);
                
                // Clear loading state if any
                guitarList.innerHTML = '';

                selected.forEach(guitar => {
                    const card = document.createElement('div');
                    card.classList.add('guitar-card');
                    
                    card.innerHTML = `
                        <img src="${guitar.image}" alt="${guitar.name}" loading="lazy">
                        <div class="card-content">
                            <h3>${guitar.name}</h3>
                            <div class="type">${guitar.type}</div>
                            <div class="description">${guitar.description}</div>
                            <div class="price">$${guitar.price.toLocaleString()}</div>
                            <button class="btn view-details-btn">View Details</button>
                        </div>
                    `;
                    
                    // Add Click Event for Modal
                    card.querySelector('.view-details-btn').addEventListener('click', (e) => {
                        e.preventDefault(); // Prevent default if it was a link, standardized for button too
                        openModal(guitar);
                    });

                    guitarList.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error loading guitars:', error);
                guitarList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Unable to load catalog at this time.</p>';
            });
    }

    // Modal Logic
    const modal = document.getElementById('guitar-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-btn');

    function openModal(guitar) {
        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="modal-body-content">
                <div class="modal-img-container">
                    <img src="${guitar.image}" alt="${guitar.name}">
                </div>
                <div class="modal-details">
                    <h2>${guitar.name}</h2>
                    <span class="type">${guitar.type} Guitar</span>
                    <p class="description">${guitar.description}</p>
                    <p>Experience the premium craftsmanship and tone that makes the ${guitar.name} a choice for professionals worldwide.</p>
                    <div class="price">$${guitar.price.toLocaleString()}</div>
                    <button class="btn" style="margin-top: 2rem;">Add to Cart</button>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
