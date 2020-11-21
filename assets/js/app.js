const API_KEY = "575e3ea9e83cb6a265c7d932c710688a";
const url = "https://api.themoviedb.org/3/search/movie?api_key=575e3ea9e83cb6a265c7d932c710688a";
const imgUrl = "https://image.tmdb.org/t/p/w300"
// const creditUrl = "https://api.themoviedb.org/3/movie/550?api_key=575e3ea9e83cb6a265c7d932c710688a&append_to_response=credits"


const btnElement = document.getElementById("search-btn")
const inputElement = document.getElementById("input-value")
const searchedMovies = document.getElementById("searched-movies")
const imageElement = document.querySelector("img")

// movieSection = (movies) => {
//    return movies.map((movie)=>{
//         return `<img src=${imgUrl + movie.poster_path} alt="" data-movie-id=${movie.id} /> 
//                  <p>Title:  ${movie.title}</p>
//                  <p>Director: </p>
//                  <p>Release Year: ${movie.release_date}</p>
//                  <p>Description: ${movie.overview} </p>` 

//     })
// }

movieSection = (movies) => {
    return movies.map((movie)=>{
        if (movie.poster_path){
            return `<img src=${imgUrl + movie.poster_path} alt="" data-movie-id=${movie.id} /> `
                // <p>Title:  ${movie.title}</p>
                // <p>Director: </p>
                // <p>Release Year: ${movie.release_date}</p>
                // <p>Description: ${movie.overview} </p>`
            }
        else{
            return `<h1> NO IMAGE AVAILABLE</h1>`
                // <p>Title:  ${movie.title}</p>
                // <p>Director: </p>
                // <p>Release Year: ${movie.release_date}</p>
                // <p>Description: ${movie.overview} </p>`
            }
    })
}

contentSection = (movies) => {
    return movies.map((movie)=>{
        return `
            <p>Title:  ${movie.title}</p>
            <p>Director: </p>
            <p>Release Year: ${movie.release_date}</p>
            <p>Description: ${movie.overview} </p>
        `
    })
}

movieContainer = (movies) => {
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", "movie");

    const movieTemplate = `
    <div class="movie-section">
        ${movieSection(movies)}  
    </div> 
    <div class="content-section">
        <p id="close-content">Close Content</p>
    </div>
`;

    // const movieTemplate = `
    //     <div class="movie-section">
    //         ${movieSection(movies)}  
    //     </div> 
    //     <div class="content-section">
    //         <p id="close-content">${contentSection(movies)}</p>
    //     </div>
    // `;

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
    
    fetch(url+ "&query=" + value)
    .then(resp => resp.json() )
    .then(renderSearchMovies)
    inputElement.value="";
}

document.onclick = (event) => {
    if (event.target.tagName === "IMG"){
        console.log(event.target.dataset.movieId)
        const movieSection = event.target.parentElement;
        const contentSection = movieSection.nextElementSibling;
        contentSection.classList.add("content-section-display")
    }

    if (event.target.id == "close-content"){
        const contentSection = event.target.parentElement;
        contentSection.classList.remove("content-section-display")
    }
}