/*
SUMMARY
DEPENDS ON: none (but requires API key, see http://www.omdbapi.com/)
FUNCTIONALITY: Calls omdb API to retrieve individual movie data and also search movies by title; passes API key in URL to authenticate request
USED BY: index.js, movie-profile.js, and movie-search.js
THANKS TO: http://www.omdbapi.com/ for offering free API keys
*/

const omdb = (function() { //module pattern

    let exportable = {}; //everything assigned to exportable is publicly exposed outside of omdb  

    const baseSearchUrl = 'http://www.omdbapi.com?s='; //note "s" 
    const baseGetUrl = 'http://www.omdbapi.com?i='; //note "i", for movie ids in IMDB format
    const apiFragment = '&apikey=';
    let apiKey;
    let searchTerm;
    let imdbId;

    /*
    PRIVATE METHODS
    */

    //create API-specific URLs
    const searchUrl = (searchTerm) => `${baseSearchUrl}${searchTerm}${apiFragment}${apiKey}`;
    const idUrl = (imdbId) => `${baseGetUrl}${imdbId}${apiFragment}${apiKey}`;
    const paginatedSearchUrl = (searchTerm, page) => searchUrl(searchTerm) + `&page=${page}`;

    //check that HTTP status code was in 200-299 range, else throw error and stop the train   
    let validate = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    //
    let validateAndParse = (promise) => {
        let results = promise.then(validate) //check HTTP response for any error
            .then((response) => response.json()) //get json from promise
            .catch((error) => console.error(error)); //catch any promise-related errors
        return results;
    }

    /*
    PUBLIC METHODS
    */
    exportable.setKey = (newKey) => apiKey = newKey;

    //within fetch(), you can optionally call searchUrl() or paginatedSearchUrl()
    exportable.getMovieList = (searchTerm, page = 1) => {
        let promise = fetch(paginatedSearchUrl(searchTerm, page)); //fetch() returns a promise
        return validateAndParse(promise);
    };

    exportable.getOneMovieProfile = (imdbId) => {
        let promise = fetch(idUrl(imdbId)); //fetch() returns a promise
        return validateAndParse(promise);
    };

    return exportable //expose all of this object's properties outside of omdb

}())