const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");
const NotFoundPage = document.querySelector(".not-found");

let oldTab = userTab;
const API_key = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");

function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            NotFoundPage.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            NotFoundPage.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",() => {
    switchTab(userTab);
})

searchTab.addEventListener("click",() => {
    switchTab(searchTab);
})

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localStorage){
        grantAccessContainer.classList.add("active");
        NotFoundPage.classList.remove("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        NotFoundPage.classList.remove("active");
        randerWeatherInfo(data);
        
    }catch(err){
        loadingScreen.classList.remove("active");
        NotFoundPage.classList.add("active");
        console.log(err);
    }
}
function randerWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        console.log("Not Found!");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else{ 
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
          );
        // console.log(response);
        const data = await response.json();
        if(String(data.cod) === '404'){
            loadingScreen.classList.remove("active");
            NotFoundPage.classList.add("active");
        }else{
            loadingScreen.classList.remove("active");
            NotFoundPage.classList.remove("active");
            userInfoContainer.classList.add("active");
            randerWeatherInfo(data);
        }
    }
    catch(err) {
        console.log("Not Found!",err);
    }
}









// async function fetchWeatherDetails(){

//     try{
//         let city = "goa";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);

//         const data = await response.json();
//         console.log("Weather Data --> ", data);
//         randerWeatherInfo(data);
//     }
//     catch(err){

//     }
// }

// async function getCustomWeatherDetails(){
    // try{
    //     let latitude = 16.333
    //     let longitude = 13.453

    //     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}&units=metric`);

    //     const data = await response.json();

    //     console.log(data);
    //     randerWeatherInfo(data);
    // }catch(err){
    //     console.log("Error Found ",err);
    // }
// }

