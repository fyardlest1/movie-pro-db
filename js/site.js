const API_KEY =
	'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDhhNWI4ODAwOTAzZjNhZGQ5YTA2NzIwZmNmODk2MiIsInN1YiI6IjVmYzA2NmJjMjcxY2E1MDA0MTU3YTU2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ariQrPAzeMP5zSbIrhSPa6Mnwe7yusJ0yLoZxxqdj5g'

// Get all list of movies
async function getPopularMovies() {
	const popularMoviesUrl = 'https://api.themoviedb.org/3/movie/popular'

	// the easy way first with fetch (asynchronous), 
    // by adding async in front of the function name
	let response = await fetch(popularMoviesUrl, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`
        }
    })

    let data = await response.json()
    displayMovies((data.results))
    
    //  the hard way first with fetch
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
    const movieCardTemplate = document.getElementById('movie-card-template')
    // find the element where the movie card will go
    const movieRow = document.getElementById('movie-row')
    movieRow.innerHTML = ''

    // for each movie in the movies array
    movies.forEach((movie) => {
        // - copy the template
        let movieCard = movieCardTemplate.content.cloneNode(true)
        // - 
        let titleElement = movieCard.querySelector('.card-body > h5')
        titleElement.textContent = movie.title

        let descriptionElement = movieCard.querySelector('.card-text')
        descriptionElement.textContent = movie.overview

        let movieImgElement = movieCard.querySelector('.card-img-top')
        movieImgElement.setAttribute('src', 'https://image.tmdb.org/t/p/w500' + movie.poster_path)

        // let's set up the id fo all movies
        let infoButton = movieCard.querySelector('.btn-primary')
        infoButton.setAttribute('data-movieId', movie.id)

        movieRow.appendChild(movieCard)
    });
}

// get the movie by id
async function getMovieDetails(infoBtn) {
	// access the movie id by getting the attribute we've set on the displayMovies function
	let movieId = infoBtn.getAttribute('data-movieId')

	// const movieDetailUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
	const movieDetailUrl = 'https://api.themoviedb.org/3/movie/' + movieId

	let response = await fetch(movieDetailUrl, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
	})

	let data = await response.json()
	// return data
	showMovieDetails(data)
	// console.log(data)
}

// display the single movie
function showMovieDetails(movie) {
	// format number to US dollar currency
	let USDollar = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	})

	// get the element where want to put the title, description, image
	let movieTitle = document.querySelector('.movieTitle')
	movieTitle.textContent = movie.title
	let movieDescription = document.querySelector('.movieDescription')
	movieDescription.textContent = movie.overview
	let moviePoster = document.querySelector('.movie-poster-details')
	moviePoster.setAttribute(
		'src',
		`https://image.tmdb.org/t/p/w500${movie.poster_path}`
	)
	let movieTagline = document.querySelector('.tagline')
	movieTagline.textContent = movie.tagline
	let movieBudget = document.querySelector('.budget')
    if (movie.budget) {
		movieBudget.textContent = USDollar.format(movie.budget)
	} else {
		movieBudget.textContent = 'Sorry! No budget info available for now.'
	}
    
	let movieRevenue = document.querySelector('.revenue')
    if (movie.revenue) {
        movieRevenue.textContent = USDollar.format(movie.revenue)
    } else {
        movieRevenue.textContent = 'Sorry! No revenue info available for now.'
    }
}
