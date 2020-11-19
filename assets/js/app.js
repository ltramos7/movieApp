const API_KEY = "575e3ea9e83cb6a265c7d932c710688a";
const url = "https://api.themoviedb.org/3/search/movie?api_key=575e3ea9e83cb6a265c7d932c710688a&query=";

const btnElement = document.getElementById("search-btn")
const inputElement = document.getElementById("input-value")

btnElement.onclick = (event) => {
    event.preventDefault()
    const value = inputElement.value
    fetch(url+value)
    .then(resp => resp.json() )
    .then(data => console.log(data))
}