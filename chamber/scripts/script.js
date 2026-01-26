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

  // View toggle functionality
  const listBtn = document.getElementById('list-btn');
  const tableBtn = document.getElementById('table-btn');
  const cardsContainer = document.getElementById('cards');

  if (listBtn && tableBtn && cardsContainer) {
    listBtn.addEventListener('click', function () {
      cardsContainer.classList.remove('table-view');
      listBtn.classList.add('active');
      tableBtn.classList.remove('active');
      localStorage.setItem('viewMode', 'list');
    });

    tableBtn.addEventListener('click', function () {
      cardsContainer.classList.add('table-view');
      tableBtn.classList.add('active');
      listBtn.classList.remove('active');
      localStorage.setItem('viewMode', 'table');
    });

    // Restore view preference from localStorage
    const savedView = localStorage.getItem('viewMode') || 'list';
    if (savedView === 'table') {
      cardsContainer.classList.add('table-view');
      tableBtn.classList.add('active');
      listBtn.classList.remove('active');
    }
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
        portrait.setAttribute("height", "250");

        card.appendChild(fullName);
        card.appendChild(phoneNumber);
        card.appendChild(website);
        card.appendChild(memberLevel);
        card.appendChild(memberSince);

        card.appendChild(portrait);
        
        cards.appendChild(card);
    })
}

// Carousel functionality for Business Spotlights
const spotlightUrl = "data/members.json";
const spotlightContainer = document.getElementById('spotlightCarousel');

async function getSpotlightData() {
    if (!spotlightContainer) return; // Exit if container doesn't exist
    
    try {
        const response = await fetch(spotlightUrl);
        const data = await response.json();
        
        // Filter for Gold and Silver members
        const qualifiedMembers = data.members.filter(member => 
            member.membership_level === 'Gold' || member.membership_level === 'Silver'
        );
        
        // Shuffle and select 4 random members
        const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());
        const selectedMembers = shuffled.slice(0, 4);
        
        displaySpotlights(selectedMembers);
    } catch (error) {
        console.error('Error loading spotlight data:', error);
    }
}

const displaySpotlights = (members) => {
    if (!spotlightContainer) return;
    
    spotlightContainer.innerHTML = ''; // Clear previous content
    
    members.forEach((member) => {
        let item = document.createElement("article");
        item.className = "spotlight-item";
        
        let image = document.createElement("img");
        image.src = member.image;
        image.alt = `${member.company} logo`;
        image.setAttribute("loading", "lazy");
        image.setAttribute("width", "250");
        image.setAttribute("height", "200");
        
        let title = document.createElement("h3");
        title.textContent = member.company;
        
        let membership = document.createElement("p");
        membership.className = "membership";
        membership.textContent = `${member.membership_level} Member`;
        
        let phone = document.createElement("p");
        phone.innerHTML = `<strong>PHONE:</strong> ${member.phone_number}`;
        
        let website = document.createElement("p");
        let link = document.createElement("a");
        link.href = member.website;
        link.target = "_blank";
        link.setAttribute("rel", "noopener noreferrer");
        link.textContent = "Visit Website";
        website.appendChild(link);
        
        item.appendChild(image);
        item.appendChild(title);
        item.appendChild(membership);
        item.appendChild(phone);
        item.appendChild(website);
        
        spotlightContainer.appendChild(item);
    });
};

// Initialize spotlights when page loads
getSpotlightData();

// Weather API functionality
const OPENWEATHER_API_KEY = '387d59bf49f6e0e5adbfa9bf485cba08'; // Free tier API key
const TUXTLA_LAT = 16.7558;
const TUXTLA_LON = -93.1084;

async function getWeatherData() {
    const currentWeatherContent = document.getElementById('currentWeatherContent');
    const forecastContent = document.getElementById('forecastContent');
    
    if (!currentWeatherContent || !forecastContent) return;
    
    try {
        // Fetch current weather and forecast
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${TUXTLA_LAT}&lon=${TUXTLA_LON}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        
        if (!response.ok) throw new Error('Weather data fetch failed');
        
        const data = await response.json();
        
        // Display current weather
        const currentData = data.list[0];
        displayCurrentWeather(currentData, data.city, currentWeatherContent);
        
        // Display forecast
        displayWeatherForecast(data.list, forecastContent);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        currentWeatherContent.innerHTML = '<p>Unable to load weather data</p>';
        forecastContent.innerHTML = '<p>Unable to load forecast</p>';
    }
}

const displayCurrentWeather = (weatherData, cityData, container) => {
    const temp = Math.round(weatherData.main.temp);
    const condition = weatherData.weather[0].main;
    const description = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const high = Math.round(weatherData.main.temp_max);
    const low = Math.round(weatherData.main.temp_min);
    
    // Calculate sunrise and sunset
    const sunrise = new Date(cityData.sunrise * 1000);
    const sunset = new Date(cityData.sunset * 1000);
    const sunriseTime = formatTime(sunrise);
    const sunsetTime = formatTime(sunset);
    
    // Get weather icon
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    container.innerHTML = `
        <div class="weather-icon">
            <img src="${iconUrl}" alt="${description}" style="width: 80px; height: 80px;">
        </div>
        <div class="weather-info">
            <p class="temperature">${temp}°C</p>
            <p class="condition">${condition}</p>
            <p><strong>High:</strong> ${high}°C</p>
            <p><strong>Low:</strong> ${low}°C</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Sunrise:</strong> ${sunriseTime}</p>
            <p><strong>Sunset:</strong> ${sunsetTime}</p>
        </div>
    `;
};

const displayWeatherForecast = (forecastList, container) => {
    const dailyForecasts = {};
    
    // Group forecasts by day
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = {
                temps: [],
                conditions: [],
                date: date
            };
        }
        
        dailyForecasts[dateKey].temps.push(Math.round(item.main.temp_max));
        dailyForecasts[dateKey].conditions.push(item.weather[0].main);
    });
    
    // Create forecast cards for the next 3 days
    const forecastDays = Object.entries(dailyForecasts).slice(0, 3);
    
    let forecastHTML = '';
    forecastDays.forEach(([dateStr, data]) => {
        const maxTemp = Math.max(...data.temps);
        const condition = data.conditions[0];
        
        forecastHTML += `
            <div class="forecast-day">
                <p class="day-name">${dateStr}</p>
                <p class="day-condition">${condition}</p>
                <p class="day-temp"><strong>${maxTemp}°C</strong></p>
            </div>
        `;
    });
    
    container.innerHTML = forecastHTML;
};

const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const displayHours = date.getHours() % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
};

// Initialize weather when page loads
getWeatherData();


// --- Join Page Functionality ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Timestamp
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // 2. Modals for Membership Levels
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const closeButtons = document.querySelectorAll('.close-modal');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = button.closest('dialog');
            if (modal) {
                modal.close();
            }
        });
    });

    // Close modal when clicking outside
    const dialogs = document.querySelectorAll('dialog');
    dialogs.forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.close();
            }
        });
    });

    //Thank You Page URL Parameter Parsing
    const submissionDetails = document.getElementById('submission-details');
    if (submissionDetails) {
        const params = new URLSearchParams(window.location.search);
        
        // Define fields to display
        const fields = [
            { key: 'first_name', label: 'First Name' },
            { key: 'last_name', label: 'Last Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'business_name', label: 'Business Name' },
            { key: 'timestamp', label: 'Submission Date' }
        ];

        let html = '';
        fields.forEach(field => {
            let value = params.get(field.key);
            if (value) {
                // Formatting timestamp if needed
                if (field.key === 'timestamp') {
                    const date = new Date(value);
                    value = date.toLocaleString();
                }
                
                html += `<p><strong>${field.label}:</strong> ${value}</p>`;
            }
        });
        
        if (html === '') {
            html = '<p>No details found. Please ensure you submitted the form correctly.</p>';
        }

        submissionDetails.innerHTML = html;
    }
});