const API_KEY = "575e3ea9e83cb6a265c7d932c710688a";
// API URLs
const searchURL = "https://api.themoviedb.org/3/search/movie?api_key=575e3ea9e83cb6a265c7d932c710688a";
const imgURL = "https://image.tmdb.org/t/p/w300"
const movieURL = "https://api.themoviedb.org/3/movie/"
const movieBackendURL = "http://localhost:3000/movies"
const popularURL = "https://api.themoviedb.org/3/movie/popular?api_key=575e3ea9e83cb6a265c7d932c710688a&language=en-US&page=1"

// DOM Elements
const searchBtnElement = document.getElementById("search-btn")
const inputElement = document.getElementById("input-value")
const searchedMovies = document.getElementById("searched-movies")
const imageElement = document.querySelector("img")
const popularMovieDiv = document.getElementById("popular-movies")

getPopularMovies = () => {
    popularMovieDiv.innerHTML = `<h3>Popular Movies</h3>`
    fetch(popularURL)
    .then(resp => resp.json())
    .then(data => renderPopularMovies(data.results))
}

renderPopularMovies = (movies) => {
    const popMovieDiv = document.createElement("div")
    popMovieDiv.setAttribute("class", "popular-movie")
    const popularMovieImages = getPopularMovieImages(movies)
    popMovieDiv.innerHTML = popularMovieImages
    popularMovieDiv.appendChild(popMovieDiv)
}

getPopularMovieImages = (movies) => {
    return movies.map((movie)=>{
        
        if (movie.poster_path){
            return `<img src=${imgURL + movie.poster_path} alt="" data-movie-id=${movie.id} /> `
        }
    })
}

searchBtnElement.onclick = (event) => {
    event.preventDefault()
    const value = inputElement.value

    fetch(searchURL+ "&query=" + value)
    .then(resp => resp.json() )
    .then(renderSearchMovies)
    inputElement.value=""; // this is clearing the input area once the search button has been clicked
    
}

renderSearchMovies = (data) => {
    searchedMovies.innerHTML = `<h3>Seached Movies</h3>`
    const movies = data.results;
    const movieArea = movieContainer(movies);
    searchedMovies.appendChild(movieArea)
}

movieContainer = (movies) => {
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", "movie");

    const movieTemplate = 
        `<div class="searched-movie-posters">
            ${movieSection(movies)}  
        </div>
        <div class="content-section"></div>`;

    movieElement.innerHTML = movieTemplate; 

    return movieElement;
}

movieSection = (movies) => {
    return movies.map((movie)=>{
       
        if (movie.poster_path){
            return `<img src=${imgURL + movie.poster_path} alt="" data-movie-id=${movie.id} /> `
        }
    })
}


// movieObject invoked from document.onclick
// this is searching for the credits of the clicked movie
movieObject = (movieId) => { 
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=575e3ea9e83cb6a265c7d932c710688a&append_to_response=credits`)
    .then(resp => resp.json() )
    .then(data => retrieveMovieData(data))
}

// this is creating the clicked movie's content card
retrieveMovieData = (movie) => {  

    const contentSection = document.querySelector(".content-section")
    const crewMembers = movie.credits.crew
    let director = ""
    crewMembers.map((member)=>{
        if (member.job.toLowerCase() == "director"){
            director = member.name
        }
    })

    const contentTemplate =
        `<p id="close-content">X</p>
        <p id="title" title="${movie.title}" data-movie-id=${movie.id}>Title: ${movie.title}</p>
        <p>Director: ${director}</p>
        <p>Release Year: ${movie.release_date}</p>
        <p>Description: ${movie.overview}</p>
        <div class="thumbs">
        <i class="fas fa-thumbs-up" id="thumbsUp" onclick="thumbRating(event)"></i>
        <i class="fas fa-thumbs-down" id="thumbsDown" onclick="thumbRating(event)"></i>
        </div>        
        `
    contentSection.innerHTML = contentTemplate
    
}

thumbRating = (event) => {
    
    event.preventDefault()
    const movie = document.getElementById("title")
    const movieId = movie.dataset.movieId
    const movieTitle = movie.title
    const thumbId = event.target.id
    
    fetch(movieBackendURL)
    .then( resp => resp.json() )
    .then( moviesDatas => {checkForMovie(moviesDatas, movieId, movieTitle, thumbId)})
    .catch( err => console.log(err))   
}
    
checkForMovie = (moviesDatas, movieId, movieTitle, thumbId) => {  

    let matchingMovie = {}

    matchingMovie = moviesDatas.find(movie => movie.movie_id == movieId)
 

    if (matchingMovie) {
        increaseCount(matchingMovie, thumbId)
    }else{
        postMovie(movieId, movieTitle, thumbId)
    }
   
}

increaseCount = (matchingMovie, thumbId) => {
    let thumbs_up = matchingMovie.thumbs_up
    let thumbs_down = matchingMovie.thumbs_down
    let backendId = matchingMovie.id

    const thumbsUp = document.getElementById("thumbsUp")
    const thumbsDown = document.getElementById("thumbsDown")    
    
    if(thumbId == "thumbsUp"){
        patchObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                thumbs_up: thumbs_up + 1
            })
        }
        fetch(movieBackendURL + `/${backendId}`, patchObj)
        .then(resp => resp.json() )
        .then(data => {
            thumbsUp.innerHTML = `${data.thumbs_up}`
        })
    }else if (thumbId == "thumbsDown"){
        patchObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                thumbs_down: thumbs_down + 1
            })
        }
        fetch(movieBackendURL + `/${backendId}`, patchObj)
        .then(resp => resp.json() )
        .then(data => {
            thumbsDown.innerHTML = `${data.thumbs_down}`
        })
    }    
}

postMovie = (movieId, movieTitle, thumbId) => {
    const thumbsUp = document.getElementById("thumbsUp")
    const thumbsDown = document.getElementById("thumbsDown")   
    
    if (thumbId == "thumbsUp"){
        postObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                movie_id: movieId,
                movie_title: movieTitle,
                thumbs_up: 1,
                thumbs_down: 0
            })
        }

        fetch(movieBackendURL, postObj)
        .then( resp => resp.json() )
        .then( movieData => {
            thumbsUp.innerHTML = `${movieData.thumbs_up}`
        })
        .catch( err => console.log(err)) 
    }else if (thumbId == "thumbsDown"){
        postObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                movie_id: movieId,
                movie_title: movieTitle,
                thumbs_up: 0,
                thumbs_down: 1
            })
        }

        fetch(movieBackendURL, postObj)
        .then( resp => resp.json() )
        .then( movieData => {
            thumbsDown.innerHTML = `${movieData.thumbs_down}`
        })
        .catch( err => console.log(err))
    }
}

// event handling
document.onclick = (event) => {
    
    if (event.target.tagName === "IMG"){
    
        const movieSection = event.target.parentElement;
        console.log(movieSection)
        
        const contentSection = movieSection.nextElementSibling;
        console.log(contentSection)
        contentSection.classList.add("content-section-display")
        
        
        movieObject(event.target.dataset.movieId)
    }

    if (event.target.id === "close-content"){
        const contentSection = event.target.parentElement;
        contentSection.classList.remove("content-section-display")
    }
}

// invoked functions
getPopularMovies()








