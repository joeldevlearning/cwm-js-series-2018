/*
SUMMARY
DEPENDENCIES: omdb.js, template.js, and movie-search.js

*/
/*
PAGE LOGIC
*/

let getHash = () => window.location.hash.split('#')[1]; //read hash from URL

function getMovieProfile() {
    omdb.getOneMovieProfile(getHash()) //call omdb with movie id from URL hash
        .then((data) =>
            document.getElementById('movie').innerHTML = template.movieProfileFull(data)
        ) //pass data to template, template returns html string, insert into DOM
} //no data returned