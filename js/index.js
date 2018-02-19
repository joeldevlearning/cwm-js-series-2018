/*
SUMMARY
DEPENDS ON: omdb.js, template.js, and movie-search.js
FUNCTIONALITY: Supports searching movies by titles; connects various DOM events and elements to search functionality
USED BY: none, but required for index.html
*/

/*
PAGE INIT LOGIC
*/

const m = new MovieSearch(omdb); //create a singleton for searching movies

//abbreviated labels for key DOM elements
const searchInput = document.querySelector('#search-form-input');
const searchForm = document.querySelector('#search-form');
const resultList = document.querySelector('#movies');
const loadMoreButton = document.querySelector('#load-more-button');
const resultCounter = document.querySelector('#result-counter-value');

let updateResultCounter = (returned, total) => {
    resultCounter.innerHTML = `Viewing ${returned} results of ${total}`;
}

let displayMsgNoResults = (query) => {
    resultCounter.innerHTML = `Sorry, no results found for '${query}'`;
}

let displayMsgEndOfResults = (query) => {
    resultCounter.innerHTML = `End of results for '${query}'`;
    loadMoreButton.disabled = true;
}

/*
EVENTS
*/

//focus the blinking cursor on the search input field
let initfocusOnSearch = () => searchInput.focus();
initfocusOnSearch(); //implicitly call once on page load

//connect the search form submit event to the 
let initOnePageSearch = () => { //connect the search
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        onePageSearch(searchInput.value);
    })
};

//write a new URL + movie id hash to the address bar
//implicitly redirects user to movie-profile.html
let loadMovieProfile = (imdbId) => {
    location.assign(`movie-profile.html#${imdbId}`);
}

/*
SEARCH LOGIC
*/

/*
initOnePageSearch();
*/

//multi-page version that replaces onePageSearch() 
//!!! WARNING: only hook ONE of these functions to the submit event
let initMultiPageSearch = () => { //connect the search
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        multiPageSearch(searchInput.value); //search via the form erases counter
    })
};
initMultiPageSearch(); //implicitly call once on page load

//reveal the "load more" button and connect its click event to 
let showLoadMoreButton = () => {
    loadMoreButton.classList.toggle("hide");
    loadMoreButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (m.hasMoreResults) {
            getNextPage();
        } else {
            disableLoadMoreButton();
        }
    })
};

let disableLoadMoreButton = () => {
    loadMoreButton.disabled = true;
    loadMoreButton.textContent = 'End of Results';
    displayMsgEndOfResults();
}

/*
PAGE LOGIC
*/

//return just the first page of results using only omdb.js
//no support for pagination, because does not use movie-search.js 
let onePageSearch = (searchText) => {
    omdb.getMovieList(searchText)
        .then((response) => {
            let movies = response.Search;
            updateResultCounter(movies.length, response.totalResults);
            let output = '';
            console.log(response);
            movies.forEach(movies => {
                output += template.movieCard(movies);
            });
            resultList.innerHTML = output; //implicitly overwrite existing results
        })
}

//returns first page of results using movie-search.js
//additional results are returned via 
let multiPageSearch = (searchText) => {
    resultList.innerHTML = '';
    let results = m.newSearch(searchText);
    results.then((results) => {
        if (results.Search) { //if we have results
            let movies = results.Search; //extract nested array of search results
            updateResultCounter(movies.length, results.totalResults);
            let output = '';
            movies.forEach(movies => {
                output += template.movieCard(movies);
            });
            resultList.innerHTML = output; //implicitly overwrite existing results
            m.hasMoreResults() ? showLoadMoreButton() : '';
        } else { //if no results, let user know
            displayMsgNoResults(searchText);
        }
    })
}

let getNextPage = () => {
    let moreResults = m.getMoreResults();
    moreResults.then((results) => {
        let movies = results.Search; //extract nested array of search results
        updateResultCounter(m.totalResultsViewed, results.totalResults);
        let output = '';
        movies.forEach(movies => {
            output += template.movieCard(movies);
        });
        resultList.insertAdjacentHTML('beforeend', output);
        m.hasMoreResults() ? '' : disableLoadMoreButton();
    });
};