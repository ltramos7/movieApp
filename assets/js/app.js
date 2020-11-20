const API_KEY = "575e3ea9e83cb6a265c7d932c710688a";
const url = "https://api.themoviedb.org/3/search/movie?api_key=575e3ea9e83cb6a265c7d932c710688a";
const imgUrl = "https://image.tmdb.org/t/p/w300"
// const creditUrl = "https://api.themoviedb.org/3/movie/550?api_key=575e3ea9e83cb6a265c7d932c710688a&append_to_response=credits"

const btnElement = document.getElementById("search-btn")
const inputElement = document.getElementById("input-value")
const searchedMovies = document.getElementById("searched-movies")

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
            return `<img src=${imgUrl + movie.poster_path} alt="" data-movie-id=${movie.id} /> 
                <p>Title:  ${movie.title}</p>
                <p>Director: </p>
                <p>Release Year: ${movie.release_date}</p>
                <p>Description: ${movie.overview} </p>`
            }
        else{
            return `<h1> NO IMAGE AVAILABLE</h1>
                <p>Title:  ${movie.title}</p>
                <p>Director: </p>
                <p>Release Year: ${movie.release_date}</p>
                <p>Description: ${movie.overview} </p>`
            }
    })}

movieContainer = (movies) => {
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", "movie");

    const movieTemplate = `
        <section class="movie-section">
            ${movieSection(movies)}  
        </section> 
        <div class="content">
            <p id="close-content">CLOSE HERE!!!!</p>
        </div>
    `;

    movieElement.innerHTML = movieTemplate;
    console.log("movieContainer function hit")
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
    console.log(value)
    
    fetch(url+ "&query=" + value)
    .then(resp => resp.json() )
    .then(renderSearchMovies)
    // inputElement.value="";
}