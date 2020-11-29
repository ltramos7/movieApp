const API_KEY = "575e3ea9e83cb6a265c7d932c710688a";
const searchURL = "https://api.themoviedb.org/3/search/movie?api_key=575e3ea9e83cb6a265c7d932c710688a";
const imgURL = "https://image.tmdb.org/t/p/w300"
const movieURL = "https://api.themoviedb.org/3/movie/"
const movieBackendURL = "http://localhost:3000/movies"

const searchBtnElement = document.getElementById("search-btn")
const inputElement = document.getElementById("input-value")
const searchedMovies = document.getElementById("searched-movies")
const imageElement = document.querySelector("img")


movieSection = (movies) => {
    return movies.map((movie)=>{
        
        if (movie.poster_path){
            return `<img src=${imgURL + movie.poster_path} alt="" data-movie-id=${movie.id} /> `
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
    </div>`;
    movieElement.innerHTML = movieTemplate; 
    return movieElement;
}

renderSearchMovies = (data) => {
    searchedMovies.innerHTML = "";
    const movies = data.results;
    const movieArea = movieContainer(movies);
    searchedMovies.appendChild(movieArea)
}

searchBtnElement.onclick = (event) => {
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
        <p id="title" title="${movie.title}" data-movie-id=${movie.id}>Title: ${movie.title}</p>
        <p>Director: ${director}</p>
        <p>Release Year: ${movie.release_date}</p>
        <p>Description: ${movie.overview}</p>
        <button id="thumbsUp" >Thumbs Up</button>   
        <button onclick="thumbsDown()">Thumbs Down</button>  
    `
    contentSection.innerHTML = contentTemplate
}

// handleThumbsUp = (event) => {
//     event.preventDefault()
//     // if the movie_title exists, add to +1 to the Thumbs up
//     // if the movie_title does not exist, create it, then add +1 to the Thumbs up
//     console.log("handleThumbsUp funciton hit.")

//     const movieInfo = document.getElementById("title")
//     console.log(movieInfo.title)


//     const postObj = {
//         method: "POST", 
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         },
//         body: JSON.stringify({
//             movie_title: movieInfo.title,
//             thumbs_up: 0,
//             thumbs_down: 0
//         })
//     }
//     fetch("http://localhost:3000/movies", postObj)
//     .then(resp => resp.json() )
//     .then( data => console.log(data))
// }

// postNewThumb = () => {

//     const postObj = {
//         method: "POST",
//         header: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         },
//         body: JSON.stringify({
//             movie_id:,
//             movie_title:,
//             thumbsUp: 0,
//             thumbsDown: 0
//         })
//     }

//     fetch("http://localhost:3000/movies/", postObj) 
// }

thumbsDown = () => {
    // if the movie_title exists, add to +1 to the Thumbs down
    // if the movie_title does not exist, create it, then add +1 to the Thumbs down
    console.log("Thumbs Down button clicked.")
}

document.onclick = (event) => {
    if (event.target.tagName === "IMG"){
        
        const movieSection = event.target.parentElement;
        const contentSection = movieSection.nextElementSibling;
        contentSection.classList.add("content-section-display")

        movieObject(event.target.dataset.movieId)
    }

    if (event.target.id === "close-content"){
        const contentSection = event.target.parentElement;
        contentSection.classList.remove("content-section-display")
    }
    
    if(event.target.id === "thumbsUp"){
        event.preventDefault()
        const movie = document.getElementById("title")
        const movieId = movie.dataset.movieId
        const movieTitle = movie.title

        // fetch(movieBackendURL, createPostObj(movieId, movieTitle))
        // .then( resp => resp.json() )
        // .then( movieData => console.log(movieData))
        // .catch( err => console.log(err))

        fetch(movieBackendURL)
        .then( resp => resp.json() )
        .then( moviesDatas => checkForMovie(moviesDatas, movieId, movieTitle))
        .catch( err => console.log(err))

        // fetch(movieBackendURL)
        // .then(resp => resp.json())
        // .then(data => matchingMovie?)

        // matchingMovie? = () => 
        //  map through each object. get object.id. Check if object.id === movieId. 
        //  if true then increase like by 1
        //  if falsek then post the new thumbed up movie to the backend.    
        // }

    }
}

checkForMovie = (moviesDatas, movieId, movieTitle) => {
    console.log("movie data", moviesDatas) //an array of possible matching movies
    console.log("movie Id", movieId)
    console.log("movieTitle", movieTitle)
    let matchingMovie = {}
    
    // const found = moviesDatas.find(movie => movie.movie_id == movieId)
    moviesDatas.forEach( movie => {
        if (movie.movie_id == movieId){
             matchingMovie = movie
        }
    })
    console.log(matchingMovie)
    debugger   
}

// createPostObj = (movieId, movieTitle) => {
//     return {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         },
//         body: JSON.stringify({
//             movie_id: movieId,
//             movie_title: movieTitle,
//             thumbs_up: 1,
//             thumbs_down: 0
//         })
//     }
// }

// addThumbsUp = () => {
    
// }


