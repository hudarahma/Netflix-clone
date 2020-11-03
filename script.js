

// Called whe the page is loaded
window.onload = () =>  {
    getOriginals();
    getTrendingNow();
    getTopRated();
    getGenres();
}




async function getMovieTrailer(id) {
    var url =   `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1`;
   return await fetch(url)
    .then((response)=>{
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("something went wrong");
        }
    })

}

const setMoveiDetail = (details) => {
    
    let movieOverview = document.getElementById("movie-overview");
    movieOverview.innerText = details.overview;

    let movieAverage = document.getElementById('vote-average');
    movieAverage.innerText =  details.vote_average; 

    let movieDate = document.getElementById('date');
    movieDate.innerText = details.release_date;

    let movieDuration = document.getElementById('run-time');
    movieDuration.innerText = details.runtime;

    let movieStatus = document.getElementById('status');
    movieStatus.innerText = details.status;


   
}


function getMovieDetail(id) {
    var url = `https://api.themoviedb.org/3/movie/${id}?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
    fetch(url)
    .then((response) => {
        return response.json();
    }).then((data) => {
        setMoveiDetail(data)
        // console.log(data)
    }).catch((error) => {
        console.log(error);
    })
}

const setTrailer = (trailers) => {
    const iframe = document.getElementById('movieTrailer');
    const movieNotFound = document.querySelector('.movie-not-found');
    if(trailers.length > 0) {
        movieNotFound.classList.add('d-none');
        iframe.classList.remove('d-none');
        iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`;

    } else {
        iframe.classList.add('d-none');
        movieNotFound.classList.remove('d-none')
    }
}

const handleMovieSelection = (e) => {
    const id = e.target.getAttribute('data-id');
    const iframe = document.getElementById('movieTrailer');

    // here need the idea of the movie
    getMovieTrailer(id).then((data) => {
        const results = data.results;
        const youtubeTrailers = results.filter((result) => {
            if (result.site == "YouTube" && result.type == "Trailer"){
                return true;
            } else {
                return false;
            }
        })
        setTrailer(youtubeTrailers);
    });
    // open  modal
    $('#TrailerModal').modal('show');

    // we need to call the api with the ID
}


function showMovies(movies, element_selector, path_type ){

    var moviesEl = document.querySelector(element_selector);

    movies.results.forEach(movie => {
        var imageElement = document.createElement('img');
        imageElement.setAttribute('data-id', movie.id);
        imageElement.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`;

        // console.log(imageElement);
        imageElement.addEventListener('click', (e) => {

            
            console.log(e);
            handleMovieSelection(e);
            getMovieDetail(movie.id);
            console.log(movie.id);
            
        })
        moviesEl.appendChild(imageElement);
    })
   
}

 function fetchMovieBaseOnGenre(genreId) {

    var url = 'https://api.themoviedb.org/3/discover/movie?';
    url += 'api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1';
    url += `&with_genres=${genreId}`;
    return fetch(url)
    .then((response)=>{
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("something went wrong");
        }
    })
   
}


function fetchMovies(url, element_selector, path_type ){
    fetch(url)
    .then((response)=>{
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("something went wrong");
        }
    })
    .then((data)=>{
        showMovies(data, element_selector, path_type);
    })
    .catch((error_data)=>{
        console.log(error_data);
    })
}


function showMoviesGenres(genres) {
    // console.log(genres);
    genres.genres.forEach(genre =>{
        // get list of movies
        var movies = fetchMovieBaseOnGenre(genre.id)
        movies.then(function(movies){
            showMovieBasedOnGenre(genre.name, movies);
        }).catch(function(error){
            console.log(error);
        })
    })
    
}

function showMovieBasedOnGenre(genreName, movies){
    let allMovies = document.querySelector('.movies');

    let genreEl = document.createElement('div');
    genreEl.classList.add("movies__header");
    genreEl.innerHTML = `
        <h2>${genreName}</h2>
    `;

    let moviesEl = document.createElement('div');
    moviesEl.classList.add('movies__container');
    moviesEl.setAttribute('id', genreName);

    // console.log(genreName);

    movies.results.forEach(movie =>{
        var imageElement = document.createElement('img');
        imageElement.setAttribute('data-id', movie.id);
        imageElement.src = `https://image.tmdb.org/t/p/original${movie["backdrop_path"]}`;

        // console.log(imageElement);
        imageElement.addEventListener('click', (e) => {
            handleMovieSelection(e);
            getMovieDetail(movie.id);
        })
        moviesEl.appendChild(imageElement);
    })

    allMovies.appendChild(genreEl);
    allMovies.appendChild(moviesEl);

}



function getGenres() {

    var url = "https://api.themoviedb.org/3/genre/movie/list?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US";
    fetch(url)
    .then((response)=>{
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("something went wrong");
        }
    })
    .then((data)=>{
        showMoviesGenres(data);
    })
    .catch((error_data)=>{
        console.log(error_data);
    })
}



function getOriginals(){
    var url = "https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
    fetchMovies(url, ".original__movies", "poster_path");
}

function getTrendingNow(){
    var url = "https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045"
    fetchMovies(url, '#trending', 'backdrop_path' );
}

function getTopRated(){
    var url = "https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1"
    fetchMovies(url, "#top_rated", "backdrop_path");
}

// https://api.themoviedb.org/3/discover/movie?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=28
// https://api.themoviedb.org/3/genre/movie/list?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US