/*
module for calling OMDB Api
Requires api key, see http://www.omdbapi.com/
Huge thanks for the creator making this freely available
*/

let omdb = (function() {

    let exposable = {}; //internal object; everything placed within "agent" will be public outside of omdb 

    const baseSearchUrl = 'http://www.omdbapi.com?s=';
    const baseGetUrl = 'http://www.omdbapi.com?i=';
    const apiFragment = '&apikey=';
    let apiKey;
    let searchTerm;
    let imdbId;
    let movieList;

    /*
    PRVIATE METHODS
    */
    let searchByStringUrl = (searchTerm) => `${baseSearchUrl}${searchTerm}${apiFragment}${apiKey}`;
    let getByIdUrl = (imdbId) => `${baseGetUrl}${imdbId}${apiFragment}${apiKey}`;

    let callSearchApi = (searchTerm) => fetch(searchByStringUrl(searchTerm));
    let callGetByIdApi = (imdbId) => fetch(getByIdUrl(imdbId));

    let validate = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
    let parseAsJson = (response) => response.json();
    let logResult = (result) => console.log(result);

    let promiseToJson = (promise) => {
        json = promise.then(validate)
            .then(parseAsJson)
            .catch((error) => console.error(error));
        return json;
    }

    /*
    PUBLIC METHODS
    */
    exposable.setKey = (newKey) => apiKey = newKey;

    exposable.getMovieList = (searchTerm) => {
        let promise = callSearchApi(searchTerm);
        return promiseToJson(promise);
    };

    exposable.getSingleMovieDetail = (imdbId) => {
        let promise = callGetByIdApi(imdbId);
        return promiseToJson(promise);
    };

    return exposable //expose all of the this object's properties outside of omdb

}())