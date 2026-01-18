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

// Carousel functionality for Business Spotlights
const carouselUrl = "data/members.json";
const carousel = document.getElementById('spotlightCarousel');
const carouselDots = document.getElementById('carouselDots');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let currentIndex = 0;
let members = [];

async function getSpotlightData() {
    if (!carousel) return; // Exit if carousel doesn't exist (e.g., on directory page)
    
    try {
        const response = await fetch(carouselUrl);
        const data = await response.json();
        members = data.members;
        displaySpotlights(members);
        setupCarouselControls();
    } catch (error) {
        console.error('Error loading spotlight data:', error);
    }
}

const displaySpotlights = (spotlightMembers) => {
    if (!carousel) return;
    
    carousel.innerHTML = ''; // Clear previous content
    
    spotlightMembers.forEach((member, index) => {
        let item = document.createElement("article");
        item.className = "spotlight-item";
        
        let image = document.createElement("img");
        image.src = member.image;
        image.alt = `${member.company} logo`;
        
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
        link.textContent = "Visit Website";
        website.appendChild(link);
        
        item.appendChild(image);
        item.appendChild(title);
        item.appendChild(membership);
        item.appendChild(phone);
        item.appendChild(website);
        
        carousel.appendChild(item);
    });
    
    // Create dots
    if (carouselDots) {
        carouselDots.innerHTML = '';
        spotlightMembers.forEach((_, index) => {
            let dot = document.createElement("span");
            dot.className = "dot";
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => goToSlide(index));
            carouselDots.appendChild(dot);
        });
    }
    
    updateCarousel();
};

const setupCarouselControls = () => {
    if (prevBtn) prevBtn.addEventListener("click", () => prevSlide());
    if (nextBtn) nextBtn.addEventListener("click", () => nextSlide());
};

const updateCarousel = () => {
    if (!carousel) return;
    
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
    
    // Update active dot
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
};

const nextSlide = () => {
    if (members.length === 0) return;
    currentIndex = (currentIndex + 1) % members.length;
    updateCarousel();
};

const prevSlide = () => {
    if (members.length === 0) return;
    currentIndex = (currentIndex - 1 + members.length) % members.length;
    updateCarousel();
};

const goToSlide = (index) => {
    currentIndex = index;
    updateCarousel();
};

// Initialize carousel when page loads
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