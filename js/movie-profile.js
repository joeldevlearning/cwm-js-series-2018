let getHash = () => window.location.hash.split('#')[1];

function getMovieProfile() {
    omdb.getSingleMovieDetail(getHash())
        .then(function(data) {
            document.getElementById('movie').innerHTML = template.oneMovieProfile(data);
        })
}