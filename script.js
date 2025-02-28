// Wait for the page to fully load before hiding preloader
window.onload = function () {
    setTimeout(() => {
        document.getElementById("preloader").style.display = "none";
        checkAuth();
    }, 2000);
};

// API Key (Replace with your OpenWeatherMap API key)
const API_KEY = "7e060c8f07483df91dc1c18fa14a5043"; // Replace this with your actual API key

// Check if user is logged in
function checkAuth() {
    let user = localStorage.getItem("user");
    if (user) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("main-container").style.display = "block";
        document.getElementById("userInitial").innerText = user.charAt(0).toUpperCase();
        getWeather("auto");
    }
}

// Authenticate User (Login/Signup)
function authenticate() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (username && password) {
        localStorage.setItem("user", username);
        checkAuth();
    } else {
        alert("Please enter valid credentials");
    }
}

// Switch Login/Signup Mode
function switchAuth() {
    let authTitle = document.getElementById("auth-title");
    let toggleAuth = document.getElementById("toggleAuth");

    if (authTitle.innerText === "Login") {
        authTitle.innerText = "Sign Up";
        toggleAuth.innerHTML = 'Already have an account? <span onclick="switchAuth()">Login</span>';
    } else {
        authTitle.innerText = "Login";
        toggleAuth.innerHTML = 'Don\'t have an account? <span onclick="switchAuth()">Sign up</span>';
    }
}

// Sidebar Toggle (with Close Button on Mobile)
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-250px"; // Hide sidebar
    } else {
        sidebar.style.left = "0px"; // Show sidebar
    }
}

// Close Sidebar
function closeSidebar() {
    document.getElementById("sidebar").style.left = "-250px";
}

// Toggle Theme
function toggleTheme(mode) {
    if (mode === "light") {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
    } else if (mode === "dark") {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
        document.body.classList.remove("light-mode");
    }
}

// Edit Profile (Example function)
function editProfile() {
    let newUsername = prompt("Enter new username:");
    if (newUsername) {
        localStorage.setItem("user", newUsername);
        document.getElementById("userInitial").innerText = newUsername.charAt(0).toUpperCase();
    }
}

// Fetch Weather Data
async function getWeather(city) {
    let url;
    
    if (city === "auto") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`;
                fetchWeather(url);
            }, (error) => {
                alert("Geolocation failed. Please search manually.");
            });
        } else {
            alert("Geolocation is not supported by your browser");
        }
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        fetchWeather(url);
    }
}

// Fetch Data and Update UI
async function fetchWeather(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        
        if (data.cod !== 200) {
            alert("City not found. Please enter a valid city name.");
            return;
        }

        document.getElementById("location").innerText = data.name;
        document.getElementById("temperature").innerText = `${data.main.temp}°C`;
        document.getElementById("weatherCondition").innerText = data.weather[0].description;
        
        let weatherIcon = document.getElementById("weatherIcon");
        let body = document.body;

        switch (data.weather[0].main.toLowerCase()) {
            case "clear":
                weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
                
                break;
            case "clouds":
                weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/414/414927.png";
                
                break;
            case "rain":
                weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";
                
                break;
            case "snow":
                weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/642/642102.png";
                break;
            case "thunderstorm":
                weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1779/1779940.png";
            default:
                weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1176/1176861.png";
                
                break;
        }
    } catch (error) {
        alert("");
    }
}

// Search City Weather
document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather(this.value);
    }
});