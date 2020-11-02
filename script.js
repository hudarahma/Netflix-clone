

// Called whe the page is loaded
window.onload = () =>  {
    getOriginals();
    getTrendingNow();
    getTopRated();
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
    movieAverage.innerText = details.vote_average;

    
   
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
    for(var movie of movies.results){
        var imageElement = document.createElement('img');
        imageElement.setAttribute('data-id', movie.id);
        imageElement.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`;

        // console.log(imageElement);
        imageElement.addEventListener('click', (e) => {

            
            console.log(e);
            handleMovieSelection(e);
            getMovieDetail(movie.id);
            
        })
        moviesEl.appendChild(imageElement);
    }
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

// function getMovieDetail() {
//     var url = "https://api.themoviedb.org/3/movie/681019?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US";

//     fetchMovies(url, "#movie-overview", "overview");
// }


