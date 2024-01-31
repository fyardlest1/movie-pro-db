const API_KEY =
	'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDhhNWI4ODAwOTAzZjNhZGQ5YTA2NzIwZmNmODk2MiIsInN1YiI6IjVmYzA2NmJjMjcxY2E1MDA0MTU3YTU2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ariQrPAzeMP5zSbIrhSPa6Mnwe7yusJ0yLoZxxqdj5g';

// Get all list of movies
async function getPopularMovies() {
	try {
		const popularMoviesUrl = 'https://api.themoviedb.org/3/movie/popular';

		// the easiest way to fetch an API (asynchronous),
		// by adding async in front of the function name
		let response = await fetch(popularMoviesUrl, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		});

		if (response.ok) {
			let data = await response.json();
			return data.results;
		}
	} catch (error) {
		console.log(error)
		return [];
	}

	//  the hard way to fetch an API
	// fetch(popularMoviesUrl, {
	//     headers: {
	//         'Authorization': `Bearer ${API_KEY}`
	//     }
	// })
	// 	.then((response) => response.json())
	// 	.then((data) => displayMovies(data.results))
}

// display all list of movies using our template
function displayMovies(movies) {
	// get our movie card template
	const movieCardTemplate = document.getElementById('movie-card-template');
	// find the element where the movie card will go
	const movieRow = document.getElementById('movie-row');
	movieRow.innerHTML = ''; // when we click the button we do not need to add another list

	// for each movie in the movies array
	movies.forEach((movie) => {
		// - copy the template
		let movieCard = movieCardTemplate.content.cloneNode(true);
		// -
		let titleElement = movieCard.querySelector('.card-body > h5');
		titleElement.textContent = movie.title;

		let descriptionElement = movieCard.querySelector('.card-text');
		descriptionElement.textContent = movie.overview;

		let movieImgElement = movieCard.querySelector('.card-img-top');
		movieImgElement.setAttribute(
			'src',
			'https://image.tmdb.org/t/p/w500' + movie.poster_path
		);

		// let's set up the id for all movies
		let infoButton = movieCard.querySelector('.btn-primary');
		infoButton.setAttribute('data-movieId', movie.id);

		// let's set up the id for the favorite button
		let favoriteButton = movieCard.querySelector('.btn-outline-primary');
		favoriteButton.setAttribute('data-movieId', movie.id);

		movieRow.appendChild(movieCard);
	});
}

// get the movie by id (single responsibility principle)
async function getMovieById(movieId) {
	try {
		const movieDetailUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
		// const movieDetailUrl = 'https://api.themoviedb.org/3/movie/' + movieId
	
		let response = await fetch(movieDetailUrl, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		});

		if (response.ok) {
			let data = await response.json();
			return data;
		}
	
	} catch (error) {
		console.log(error);
		return undefined;
	}
}

// get the movie details
async function getMovieDetails(infoBtn) {
	// access the movie id by getting the attribute we've set on the displayMovies function
	let movieId = infoBtn.getAttribute('data-movieId');

	let movie = await getMovieById(movieId);

	if (movie != undefined) {
		// return data object
		showMovieDetails(movie);
	}
}

// display the single movie
function showMovieDetails(movie) {
	// format number to US dollar currency
	let USDollar = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	// get the element where want to put the title, description, image
	let movieTitle = document.querySelector('.movieTitle');
	movieTitle.textContent = movie.title;
	let movieDescription = document.querySelector('.movieDescription');
	movieDescription.textContent = movie.overview;
	let moviePoster = document.querySelector('.movie-poster-details');
	moviePoster.setAttribute(
		'src',
		`https://image.tmdb.org/t/p/w500${movie.poster_path}`
	);
	let movieTagline = document.querySelector('.tagline');
	if (movie.tagline) {
		movieTagline.textContent = movie.tagline;
	} else {
		movieTagline.textContent = movie.title;
	}

	let movieBudget = document.querySelector('.budget');
	if (movie.budget) {
		movieBudget.textContent = USDollar.format(movie.budget);
	} else {
		movieBudget.textContent = 'No budget info available for now.';
	}

	let movieRevenue = document.querySelector('.revenue');
	if (movie.revenue) {
		movieRevenue.textContent = USDollar.format(movie.revenue);
	} else {
		movieRevenue.textContent = 'No revenue info available for now.';
	}

	// release-date
	let releaseDate = document.querySelector('.release-date');
	releaseDate.textContent = convertDate(movie.release_date);

	// Accessing attributes inside the 'genres' attribute
	const nameAttributes = movie.genres.map((item) => item.name);
	const genresName = nameAttributes.join(', ');
	let movieGenres = document.querySelector('.movie-genres');
	movieGenres.textContent = genresName;

	// getting the img with the class productionCompanies
	let companiesLogo = document.querySelector('.productionCompanies');
	companiesLogo.innerHTML = '';
	// Accessing the production_companies
	let productionCompanies = movie.production_companies.map(
		(item) => item.logo_path
	);

	// getting each logo and create a new image
	productionCompanies.forEach((logo) => {
		// check if the logo exist
		if (logo) {
			// create a new image element
			let newImage = document.createElement('img');
			newImage.setAttribute(
				'src',
				`https://image.tmdb.org/t/p/w500${logo}`
			);
			newImage.setAttribute('class', 'w-25 pe-2');
			newImage.setAttribute('alt', 'Company logo');
			// add the new image to the screen
			companiesLogo.appendChild(newImage);
		}
	});
}

// convert the date format
function convertDate(inputDate) {
	const dateObject = new Date(inputDate);

	// Define options for formatting
	const options = {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	};

	// Use toLocaleDateString with the defined options
	const formattedDate = dateObject.toLocaleDateString('en-US', options);

	return formattedDate;
}

// display popular movies from the API
async function displayPopularMovies() {
	let movies = await getPopularMovies();
	displayMovies(movies);
}

// display the movies from the localstorge
function displayFavoriteMovies() {
	// get movies from getFavoriteMovies
	let movies = getFavoriteMovies();
	// display them (using displayMovies)
	displayMovies(movies);
}

// Favorite movies
async function addFavoriteMovies(btn) {
	// save one new movie to our list of favorites
	let movieId = btn.getAttribute('data-movieId');

	// get my favorite movies
	let favorites = getFavoriteMovies();

	let duplicateMovieId = favorites.find((movie) => movie.id == movieId);

	// do not duplicate movies
	if (duplicateMovieId == undefined) {
		// get the whole movie
		let newFavorite = await getMovieById(movieId);

		if (newFavorite != undefined) {
			// add the new movie to the array
			favorites.push(newFavorite);
			// save the new array of movies
			saveFavoriteMovies(favorites);
		}
	}
}

// remove a favorite movie
function removeFavoriteMovies(btn) {
	// remove one movie from our list of favorites
	let movieId = btn.getAttribute('data-movieId');
	// remove the movie from our list in local storage
	let favorites = getFavoriteMovies();
	favorites = favorites.filter(movie => movie.id != movieId);
	saveFavoriteMovies(favorites);
	// display the new list of favorites
	displayFavoriteMovies()
}

// using local storage to save our favorites
function saveFavoriteMovies(movies) {
	// serialization of the data
	// turn and array of objects into string
	let moviesAsString = JSON.stringify(movies);
	// save a complete list of our favorite movies
	localStorage.setItem('fyard-favorite-movies', moviesAsString);
}

// get our favorite movies from the local storage
function getFavoriteMovies() {
	// retrive our list of favorite movies
	// return the list of movies
	let favoriteMovies = localStorage.getItem('fyard-favorite-movies');
	// null if we don't have not saved any movies yet
	if (favoriteMovies == null) {
		favoriteMovies = [];
		saveFavoriteMovies(favoriteMovies);
	} else {
		// deserialization of the data
		favoriteMovies = JSON.parse(favoriteMovies);
	}

	return favoriteMovies;
}

