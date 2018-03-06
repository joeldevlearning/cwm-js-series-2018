/*
SUMMARY
DEPENDENCIES: omdb.js
FUNCTIONALITY: Calls omdb module to retrieve movie search results; allows returning multiple "pages" (sets) of results by keeping a "memory" of result counts, up to 100 pages
USED BY: index.js
NOTES: This class is customized for the OMDB API, but is DOM-agnostic
*/

class MovieSearch {
    constructor(api) { //requires omdb mobile
        this.api = api;
        this.searchText;
        this.totalResultsFound = 0; //fixed for a given query
        this.totalResultsViewed = 0; //increments as user asks for more results
    }

    //calculate total pages, where 1 page = 10 results; count starts from 1
    totalPages() {
        if (this.totalResultsFound > 10) {
            return Math.round(this.totalResultsFound / 10);
        } else return 1;
    }

    remainingPages() {
        return Math.round((this.totalResultsFound - this.totalResultsViewed) / 10);
    }

    currentPage() {
        return this.totalPages() - this.remainingPages();
    }

    //check if there are more results available for the current search term
    hasMoreResults() {
        return this.remainingPages() > 0 ? true : false;
    }

    reset() {
        this.totalResultsFound, this.totalResultsViewed = 0;
    }

    //generic wrapper for omdb, used by both newSearch() and getMoreResults()
    getFromApi(page = 1) { //default parameter 
        let response = omdb.getMovieList(this.searchText, page) //call omdb directly
        response
            .then((response) => {
                if (response.totalResults) { //if we have results
                    this.totalResultsFound = response.totalResults;
                    this.totalResultsViewed += response.Search.length; //increment with each call
                }
            });
        return response;
    }

    //called by search input field, ovewriting previous search
    newSearch(searchText) {
        this.reset(); //reset counts
        this.searchText = searchText;
        return this.getFromApi();
    }

    //the load more button calls displayMoreResults
    //we assume that caller has checked hasMoreResults() before invoking this function
    getMoreResults() {
        return this.getFromApi(this.currentPage() + 1);
    }
}