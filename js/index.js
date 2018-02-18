let focusOnSearch = () => document.querySelector('#search-form-input').focus();
focusOnSearch();

let enableSearch = () => document.querySelector('#search-form')
    .addEventListener("submit", (event) => {
        event.preventDefault();
        searchFor(document.querySelector('#search-form-input').value);
    });
enableSearch();

/*
let loadMoreOnClick = () => document.querySelector('#load-more-button')
    .addEventListener("click", (event) => {

    });
loadMoreOnClick();
*/
let appendMovieCard = () => {
    let movieCards = '<div>sample movie card</div>';
    var textnode = document.createTextNode("Water"); // Create a text node
    node.appendChild(textnode); // Append the text to <li>
    document.getElementById("myList").appendChild(node); // Append <li> to <ul> with id="myList"
}

let searchFor = (searchText) => {
    omdb.getMovieList(searchText)
        .then((response) => {
            let movies = response.Search;
            let output = '';
            movies.forEach(movies => {
                output += template.movieCard(movies);
            });
            document.getElementById('movies').innerHTML = output;
        })
}

let loadMovieProfile = (imdbId) => {
    location.assign(`movie-profile.html#${imdbId}`);
}