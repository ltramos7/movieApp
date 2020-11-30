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

//this is searching for the credits of the clicked movie
movieObject = (movieId) => { 
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=575e3ea9e83cb6a265c7d932c710688a&append_to_response=credits`)
    .then(resp => resp.json() )
    .then(data => retrieveMovieData(data) )
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

    const contentTemplate = `
        <p id="title" title="${movie.title}" data-movie-id=${movie.id}>Title: ${movie.title}</p>
        <p>Director: ${director}</p>
        <p>Release Year: ${movie.release_date}</p>
        <p>Description: ${movie.overview}</p>
        <button id="thumbsUp" >Thumbs Up</button>   
        <button id="thumbsDown">Thumbs Down</button>  
    `
    contentSection.innerHTML = contentTemplate
}


// event handling
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
    
    // this if statement is listening for a thumbsup/down to then make a patch request if a review
    // of the movie exists or a post request if the movie does not have an exisiting review. 
    if(event.target.id === "thumbsUp" || event.target.id === "thumbsDown"){
        event.preventDefault()
        const movie = document.getElementById("title")
        const movieId = movie.dataset.movieId
        const movieTitle = movie.title
        const thumbId = event.target.id


        fetch(movieBackendURL)
        .then( resp => resp.json() )
        .then( moviesDatas => checkForMovie(moviesDatas, movieId, movieTitle, thumbId))
        .catch( err => console.log(err))


    }
}

checkForMovie = (moviesDatas, movieId, movieTitle, thumbId) => {
    console.log(moviesDatas)
    
    let matchingMovie = {}
    
    if (moviesDatas.length !== 0){
        console.log("some movies exist")
        

        moviesDatas.forEach( movie => {
            //might need to do movie.movie_id == movieObject.id
            if (movie.movie_id == movieId & thumbId === "thumbsUp"){
                matchingMovie = movie

                increaseCount(matchingMovie) // patch request to update the thumbs up count
            }
            else if (movie.movie_id == movieId & thumbId === "thumbsDown" ) {
                increaseCount(matchingMovie) // patch request to update teh thumbs down count
            }
            else if(movie.movie_id !== movieId){
                postMovie(movieId, movieTitle, thumbId)
            }
        })
    } else if (moviesDatas.length == 0){
        postMovie(movieId, movieTitle, thumbId) 
    }
   
}

increaseCount = (matchingMovie) => {
    console.log(matchingMovie)
    console.log("movie already exists, so next step is to make a patch update")
    
}


postMovie = (movieId, movieTitle, thumbId) => {
    console.log(movieId, movieTitle, thumbId)
    console.log("postMovie function reached")
    // if thumbId == thumbsUp then post with thumbs_up: 1 and thumbs_down: 0

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
        .then( movieData => console.log(movieData))
        .catch( err => console.log(err)) 

    }
    else if (thumbId == "thumbsDown"){
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
        .then( movieData => console.log(movieData))
        .catch( err => console.log(err))
    }
}








