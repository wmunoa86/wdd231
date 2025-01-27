// script.js
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData();
    fetchSpotlightData();
});

function fetchWeatherData() {
    const apiKey = 'f10380eef9f57aaa4cd5bc728cbe2c3e';  // Asegúrate de que esta sea tu API Key válida
    const city = 'London';  // Puedes cambiar la ciudad aquí
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Agregar console.log para depuración
            const weatherData = `
                <p>Current Temperature: ${Math.round(data.main.temp)}°F</p>
                <p>Weather Description: ${capitalizeWords(data.weather[0].description)}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            `;
            document.getElementById('weather-data').innerHTML = weatherData;
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function fetchSpotlightData() {
    const spotlightData = [
        {
            name: 'Company A',
            logo: 'company-a.png',
            phone: '(503) 111-1111',
            address: '123 Main St, San Miguel, El Salvador',
            website: 'https://company-a.com',
            membership: 'gold'
        },
        {
            name: 'Company B',
            logo: 'company-b.png',
            phone: '(503) 222-2222',
            address: '456 Elm St, San Miguel, El Salvador',
            website: 'https://company-b.com',
            membership: 'silver'
        },
        {
            name: 'Company C',
            logo: 'company-c.png',
            phone: '(503) 333-3333',
            address: '789 Oak St, San Miguel, El Salvador',
            website: 'https://company-c.com',
            membership: 'gold'
        }
    ];

    const filteredData = spotlightData.filter(member => ['gold', 'silver'].includes(member.membership));
    const shuffledData = filteredData.sort(() => 0.5 - Math.random()).slice(0, 2);
    const spotlightCards = shuffledData.map(member => `
        <div class="spotlight-card">
            <img src="${member.logo}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p>Phone: ${member.phone}</p>
            <p>Address: ${member.address}</p>
            <p>Website: <a href="${member.website}" target="_blank">${member.website}</a></p>
            <p>Membership: ${member.membership}</p>
        </div>
    `).join('');
    document.getElementById('spotlight-cards').innerHTML = spotlightCards;
}


