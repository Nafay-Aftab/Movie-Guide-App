const searchForm = document.querySelector("form");
const movieContainer = document.querySelector(".movie-container");
const inputBox = document.querySelector(".inputBox");

const getMovieInfo = async (movie) => {
    const apikey = "8f472917";
    const URL = `https://www.omdbapi.com/?apikey=${apikey}&t=${movie}`;

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error("Unable to fetch movie data");
        }
        const data = await response.json();
        if (data.Response === "False") {
            showErrorMessage("No movie found");
        } else {
            showMovieData(data);
            localStorage.setItem("lastMovie", movie); // Save the movie name
        }
    } catch (error) {
        showErrorMessage("No movie found");
    }
};

const showMovieData = (data) => {
    const { Title, imdbRating, Genre, Released, Runtime, Actors, Plot, Poster } = data;

    // Clear previous movie data
    movieContainer.innerHTML = "";
    movieContainer.classList.remove("noBackground");

    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-info");
    movieElement.innerHTML = `<h2>${Title}</h2>
    <p ><strong>Rating: &#11088;</strong> ${imdbRating}</p>`;

    const movieGenreElement = document.createElement("div");
    movieGenreElement.classList.add("movie-genre");

    Genre.split(",").forEach(element => {
        const p = document.createElement("p");
        p.innerText = element.trim();
        movieGenreElement.appendChild(p);
    });

    movieElement.appendChild(movieGenreElement);

    movieElement.innerHTML += `<p><strong>Released: </strong>${Released}</p>
                              <p><strong>Duration: </strong>${Runtime}</p>
                              <p><strong>Cast: </strong>${Actors}</p>
                              <p><strong>Plot: </strong>${Plot}</p>`;

    const moviePosterElement = document.createElement("div");
    moviePosterElement.classList.add("movie-poster");
    moviePosterElement.innerHTML = `<img src="${Poster}" alt="${Title} Poster"/>`;

    movieContainer.appendChild(moviePosterElement);
    movieContainer.appendChild(movieElement);
};

const showErrorMessage = (message) => {
    movieContainer.innerHTML = `<h2>${message}</h2>`;

    movieContainer.classList.add("noBackground");
};

// Handle form submission
const HandleFormSubmission = (e) => {
    e.preventDefault();
    const movieName = inputBox.value.trim();
    if (movieName !== "") {
        getMovieInfo(movieName);
    } else {
        showErrorMessage("Enter movie name to get information...");
    }
};

searchForm.addEventListener("submit", HandleFormSubmission);

// Retrieve last searched movie when page loads
document.addEventListener("DOMContentLoaded", () => {
    const lastMovie = localStorage.getItem("lastMovie");
    if (lastMovie) {
        getMovieInfo(lastMovie);
    }
});
