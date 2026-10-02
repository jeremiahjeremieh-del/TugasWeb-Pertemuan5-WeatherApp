
const API_KEY = "1d0f9c2eff1991d6142c99fd5eb5f671";

const BASE_URL =
    "https://api.openweathermap.org/data/2.5/weather";


const form = document.querySelector("#searchForm");

const input = document.querySelector("#cityInput");

const loading = document.querySelector("#loading");

const error = document.querySelector("#error");

const result = document.querySelector("#weatherResult");

const cityName = document.querySelector("#cityName");

const weatherIcon = document.querySelector("#weatherIcon");

const temperature = document.querySelector("#temperature");

const description = document.querySelector("#description");

const humidity = document.querySelector("#humidity");

const wind = document.querySelector("#wind");

const historyList = document.querySelector("#historyList");



const getHistory = () => {

    return JSON.parse(
        localStorage.getItem("weatherHistory")
    ) || [];

};


const saveHistory = (city) => {

    const history = getHistory();

    const filteredHistory = history.filter(
        item =>
            item.toLowerCase() !== city.toLowerCase()
    );

    filteredHistory.unshift(city);

    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(
            filteredHistory.slice(0, 5)
        )
    );

    displayHistory();

};



const displayHistory = () => {

    const history = getHistory();

    historyList.innerHTML = history
        .map(city => `
            <li data-city="${city}">
                ${city}
            </li>
        `)
        .join("");

    historyList
        .querySelectorAll("li")
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const city =
                        item.dataset.city;

                    input.value = city;

                    getWeather(city);

                }
            );

        });

};



const showLoading = () => {

    loading.classList.remove("hidden");

    error.classList.add("hidden");

    result.classList.add("hidden");

};


const hideLoading = () => {

    loading.classList.add("hidden");

};




const showError = (message) => {

    error.textContent = message;

    error.classList.remove("hidden");

    result.classList.add("hidden");

};


// =======================================
// DISPLAY WEATHER
// ========================================

const displayWeather = (data) => {

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt =
        data.weather[0].description;

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    description.textContent =
        data.weather[0].description;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
        `${data.wind.speed} m/s`;

    result.classList.remove("hidden");

};



const getWeather = async (city) => {

    try {

        // Validasi input
        if (!city || city.trim() === "") {

            throw new Error(
                "Nama kota tidak boleh kosong."
            );

        }


        // Cek API Key
        if (
            API_KEY ===
            "MASUKKAN_API_KEY_DISINI"
        ) {

            throw new Error(
                "API Key belum dimasukkan. Silakan isi API_KEY di app.js."
            );

        }


        showLoading();


        // URL API
        const url =
            `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=id`;


        // Fetch API
        const response =
            await fetch(url);


        // Kota tidak ditemukan
        if (response.status === 404) {

            throw new Error(
                `Kota "${city}" tidak ditemukan.`
            );

        }


        // Error server
        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        // Ambil JSON
        const data =
            await response.json();


        // Tampilkan data
        displayWeather(data);


        // Simpan riwayat
        saveHistory(data.name);


    } catch (err) {

        // Network error
        if (err instanceof TypeError) {

            showError(
                "Network error. Periksa koneksi internet Anda."
            );

        } else {

            showError(
                err.message
            );

        }

    } finally {

        hideLoading();

    }

};


// ========================================
// FORM EVENT
// ========================================

form.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const city =
            input.value.trim();

        if (city) {

            getWeather(city);

        }

    }
);




displayHistory();