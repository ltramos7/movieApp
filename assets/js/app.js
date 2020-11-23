const API_KEY = "575e3ea9e83cb6a265c7d932c710688a";
const searchURL = "https://api.themoviedb.org/3/search/movie?api_key=575e3ea9e83cb6a265c7d932c710688a";
const imgUrl = "https://image.tmdb.org/t/p/w300"
const movieUrl = "https://api.themoviedb.org/3/movie/"
// const creditUrl = "https://api.themoviedb.org/3/movie/550?api_key=575e3ea9e83cb6a265c7d932c710688a&append_to_response=credits"


// this url gets the specific movie by it's movie ID and appends the credits
// https://api.themoviedb.org/3/movie/1891?api_key=575e3ea9e83cb6a265c7d932c710688a&append_to_response=credits so I need to make the id of 1891 change

// movieUrl + movie_id + "api_key=${API_KEY}&append_to_response=credits

// I should think about making an append for the credits and Images


// /credit/{credit_id} I think the movie searched for has a credit_id so I need to find it liked what was done for movieId.


const btnElement = document.getElementById("search-btn")
const inputElement = document.getElementById("input-value")
const searchedMovies = document.getElementById("searched-movies")
const imageElement = document.querySelector("img")


movieSection = (movies) => {
    return movies.map((movie)=>{
        
        if (movie.poster_path){
            return `<img src=${imgUrl + movie.poster_path} alt="" data-movie-id=${movie.id} /> `
        }
        else{
            return `<h1> NO IMAGE AVAILABLE</h1>`
        }
    })
}

movieContainer = (movies) => {
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", "movie");

    const movieTemplate = `
    <div class="searched-movie-section">
        ${movieSection(movies)}  
    </div> 
    <div class="content-section">
        <p id="close-content">Close Content</p>
        <button>Thumbs Up</button>   
        <button>Thumbs Down</button>   
    </div>
`;
    movieElement.innerHTML = movieTemplate; 
    return movieElement;
}

renderSearchMovies = (data) => {
    searchedMovies.innerHTML = "";
    const movies = data.results;
    const movieArea = movieContainer(movies);
    searchedMovies.appendChild(movieArea)
}



btnElement.onclick = (event) => {
    event.preventDefault()
    const value = inputElement.value
    
    fetch(searchURL+ "&query=" + value)
    .then(resp => resp.json() )
    .then(renderSearchMovies)
    inputElement.value="";
}

movieObject = (movieId) => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=575e3ea9e83cb6a265c7d932c710688a&append_to_response=credits`)
    .then(resp => resp.json() )
    .then(data => retrieveMovieData(data) )
}

retrieveMovieData = (movie) => {
    const contentSection = document.querySelector(".content-section")
    const crewMembers = movie.credits.crew
    let director = ""
    crewMembers.map((member)=>{
        if (member.job.toLowerCase() == "director"){
            director = member.name
        }
    })

    const contentTemplate = `
        <p>Title: ${movie.title}</p>
        <p>Director: ${director}</p>
        <p>Release Year: ${movie.release_date}</p>
        <p>Description: ${movie.overview}</p>
    `
    contentSection.innerHTML = contentTemplate
 
}

document.onclick = (event) => {
    if (event.target.tagName === "IMG"){
        
        const movieSection = event.target.parentElement;
        const contentSection = movieSection.nextElementSibling;
        contentSection.classList.add("content-section-display")

        movieObject(event.target.dataset.movieId)
    }

    if (event.target.id == "close-content"){
        const contentSection = event.target.parentElement;
        contentSection.classList.remove("content-section-display")
    }
}