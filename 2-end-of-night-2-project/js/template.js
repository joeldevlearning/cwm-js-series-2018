/*
SUMMARY
DEPENDS ON: none
FUNCTIONALITY: Supports mixing javascript variables with html (in string form) via template literals
USED BY: index.js and movie-profile.js
NOTE: The template functions each return strings, not DOM nodes. To insert them into the DOM, assign their value to innerHTML or similar (the append* methods will NOT work).
*/

const template = (function() { //module pattern

    let exportable = {};

    /*
    INDEX.JS TEMPLATE
    */

    /*
    example placeholder urls:
    url + size + color in hex
    http://via.placeholder.com/175x263/33363a
    http://via.placeholder.com/640x480/33363a
    */
    let getPlaceholderUrl = (height, width) => {
        return `http://via.placeholder.com/${height}x${width}/33363a`
    };

    exportable.render = (movies) => {
        let output = '';
        movies.forEach(movies => {
            if (movies.Poster === 'N/A') {
                movies.Poster = getPlaceholderUrl('175', '263');
            };
            output += template.movieCard(movies);
        });
        return output;
    }

    exportable.movieCard = (movie) => {
        return `
        <li>
          <a onclick="loadMovieProfile('${movie.imdbID}')" href="#">
          <div class="movie-card">
            <img src="${movie.Poster}" alt="${movie.Title}, ${movie.Year}">
            <br>
            <span class="movie-card-title heavy">${movie.Title}</span>
            <br>
            <span class="movie-card-year">${movie.Year}</span>
          </div>
          </a>
        </li>
    `;
    }

    /*
    MOVIE-PROFILE.JS TEMPLATE
    */

    exportable.movieProfileFull = (movie) => {
        if (movie.Poster === 'N/A') {
            movie.Poster = getPlaceholderUrl('640', '480');
        }
        return `<div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="img-fluid">
          </div>
          <div class="col-md-8">
            <h3>${movie.Title}</h3>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <br>
        <div class="row">
        <div class="col-md-12">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" data-imdbId="${movie.imdbID} "target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
        </div>
        <br><br>
      `;
    }

    return exportable;

}());
