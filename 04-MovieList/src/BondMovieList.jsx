import React from 'react';

import './BondMovieList.css';

class BondMovie extends React.Component {
    render() {
        var index = this.props.index;
        var movie = this.props.movie;

        return (
            <div className="bond-movie">
                <div className="bond-movie-left"><div className="bond-movie-index">{index + 1}</div></div>
                <div className="bond-movie-poster">
                    <img src={movie.poster} />
                </div>
                <div className="bond-movie-body">
                    <div className="bond-movie-title">{movie.title} <span className="bond-movie-year">({movie.year})</span></div>
                    <div>Bond: {movie.bond}</div>
                    <div className="bond-movie-overview">{movie.overview}</div>
                </div>
            </div>
        );
    }
}

class BondMovieList extends React.Component {
    render() {

        var movieList = this.props.movies;
        var movieElems = movieList.map(function (movie, index) {

            var key = movie.year;

            return (
              <BondMovie key={key} index={index} movie={movie}/> 
            );
        });

        return (
            <div className="bond-movielist">{movieElems}</div>
        );
    }
}

export default BondMovieList;