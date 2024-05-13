document.addEventListener("DOMContentLoaded", () => {
  const locButton = document.querySelector(".loc-button");
  const todayInfo = document.querySelector(".today");
  const todayWeatherIcon = document.querySelector(".weather i");
  const todayTemp = document.querySelector(".temp");
  const smallInfo = document.querySelector(".right .small-info");

  console.log(todayInfo, todayWeatherIcon, todayTemp, smallInfo);

  const weatherIconMap = {
    "01d": "sun",
    "01n": "moon",
    "02d": "sun",
    "02n": "moon",
    "03d": "cloud",
    "03n": "cloud",
    "04d": "cloud",
    "04n": "cloud",
    "09d": "cloud-rain",
    "09n": "cloud-rain",
    "10d": "cloud-rain",
    "10n": "cloud-rain",
    "11d": "cloud-lightning",
    "11n": "cloud-lightning",
    "13d": "cloud-snow",
    "13n": "cloud-snow",
    "50d": "water",
    "50n": "water",
  };

  function fetchWeatherData(location) {
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        const todayWeather = data.list[0].weather[0].description;
        const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
        const todayWeatherIconCode = data.list[0].weather[0].icon;

        const todayDate = new Date(data.list[0].dt * 1000);
        if (todayInfo) {
          todayInfo.querySelector("h2").textContent =
            todayDate.toLocaleDateString("en", { weekday: "long" });
          todayInfo.querySelector("span").textContent =
            todayDate.toLocaleDateString("en", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          const locationElement = todayInfo.querySelector("span:last-child");
          locationElement.textContent = `${data.city.name}, ${data.city.country}`;
        }

        if (todayWeatherIcon) {
          todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
        }
        if (todayTemp) {
          todayTemp.textContent = todayTemperature;
        }

        const weatherDescriptionElement = todayInfo.querySelector("h3");
        if (weatherDescriptionElement) {
          weatherDescriptionElement.textContent = todayWeather;
        }

        const todayPrecipitation = `${data.list[0].pop}%`;
        const todayHumidity = `${data.list[0].main.humidity}%`;
        const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

        if (smallInfo) {
          const smallInfoElements = smallInfo.querySelectorAll(".value");
          if (smallInfoElements.length === 3) {
            smallInfoElements[0].textContent = todayPrecipitation;
            smallInfoElements[1].textContent = todayHumidity;
            smallInfoElements[2].textContent = todayWindSpeed;
          }
        }

        const nextDaysData = data.list
          .filter((entry) => {
            const entryDate = new Date(entry.dt_txt);
            return entryDate.getHours() === 12;
          })
          .slice(1, 5);

        const daysList = document.querySelector(".small-list");
        if (daysList) {
          daysList.innerHTML = "";
          nextDaysData.forEach((dayData) => {
            const dayAbbreviation = new Date(dayData.dt_txt).toLocaleDateString(
              "en",
              { weekday: "short" }
            );
            const dayTemp = `${Math.round(dayData.main.temp)}°C`;
            const iconCode = dayData.weather[0].icon;

            daysList.innerHTML += `
                            <li>
                                <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                                <span>${dayAbbreviation}</span>
                                <span class="small-temp">${dayTemp}</span>
                            </li>
                        `;
          });
        }
      })
      .catch((error) => {
        alert(`Error fetching weather data: ${error}`);
      });
  }

  locButton.addEventListener("click", () => {
    const location = prompt("Enter a location:");
    if (!location) return;

    fetchWeatherData(location);
  });
});
