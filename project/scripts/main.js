document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.querySelector('nav ul');

    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        hamburgerBtn.classList.toggle('active');
    });

    // Display Guitars
    const guitarList = document.getElementById('guitar-list');
    const allGuitarsList = document.getElementById('all-guitars-list');
    
    if (guitarList || allGuitarsList) {
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
                // Function to render cards
                const renderGuitars = (items, container) => {
                    container.innerHTML = '';
                    items.forEach(guitar => {
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

                        container.appendChild(card);
                    });
                };

                // Index Page: Random 3
                if (guitarList) {
                    const shuffled = [...data].sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 3);
                    renderGuitars(selected, guitarList);
                }

                // Guitars Page: All
                if (allGuitarsList) {
                    renderGuitars(data, allGuitarsList);
                }
            })
            .catch(error => {
                console.error('Error loading guitars:', error);
                const errorMsg = '<p style="grid-column: 1/-1; text-align: center;">Unable to load catalog at this time.</p>';
                if (guitarList) guitarList.innerHTML = errorMsg;
                if (allGuitarsList) allGuitarsList.innerHTML = errorMsg;
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

    // Handle Form Submission on thanks.html
    const submissionDetails = document.getElementById('submission-details');
    if (submissionDetails) {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name');
        const email = params.get('email');
        const message = params.get('message');

        if (name && email) {
            submissionDetails.innerHTML = `
                <h2 style="color: var(--color-roasted-maple); width: 100%; text-align: center; margin-bottom: 1.5rem;">Thank You!</h2>
                <p style="margin-bottom: 1rem;">We have received your message with the following details:</p>
                <div style="background: #f9f9f9; padding: 1rem; border-radius: 4px; width: 100%; border: 1px solid #eee;">
                    <p style="margin-bottom: 0.5rem;"><strong>Name:</strong> ${name}</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Email:</strong> ${email}</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Message:</strong></p>
                    <p style="font-style: italic; color: #555;">${message || 'No message provided.'}</p>
                </div>
                <p style="margin-top: 1.5rem; font-size: 0.9rem; color: #666; width: 100%; text-align: center;">We will get back to you shortly.</p>
            `;
        } else {
            submissionDetails.innerHTML = '<p class="text-center" style="width: 100%;">No submission data found. Please fill out the <a href="contact.html" style="color: var(--color-roasted-maple);">contact form</a>.</p>';
        }
    }
});
