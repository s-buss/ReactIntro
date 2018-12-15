import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './BondMovieList.css';

class BondMovie extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = { isHovered: false };

        // Bind event handling methods to this
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleMouseEnter() {
        this.setState({ isHovered: true });
    }

    handleMouseLeave() {
        this.setState({ isHovered: false });
    }

    moveUp() {

        // Save the last position of this element for scrolling
        this._lastPos = $(ReactDOM.findDOMNode(this)).offset().top;

        // Let the parent move this entry to a new position.
        this.props.onMoveUp(this.props.movie);
    }

    moveDown() {
        // Save the last position of this element for scrolling
        this._lastPos = $(ReactDOM.findDOMNode(this)).offset().top;

        // Let the parent move this entry to a new position.
        this.props.onMoveDown(this.props.movie);
    }

    delete() {
        this.props.onDelete(this.props.movie);
    }

    // Will be called after rendering this component, but not after the initial rendering.
    // We use it here to see how much the component has moved vertically and adjust the scroll
    // position.
    componentDidUpdate() {
        var lastPos = this._lastPos;
        this._lastPos = undefined;

        if (lastPos) {
            var newPos = $(ReactDOM.findDOMNode(this)).offset().top;

            var oldTop = window.scrollY;
            $("html, body").stop().animate({ scrollTop: oldTop + newPos - lastPos }, "250", "linear");
        }
    }

    render() {

        var movie = this.props.movie;

        console.log(`${BondMovie.renderCounter++} Rendering Movie '${movie.title}'`);

        var className = "bond-movie";
        var buttonUp = undefined;
        var buttonDown = undefined;
        var buttonDelete = undefined;
        if (this.state.isHovered) {
            className = "bond-movie bond-movie-hovered";
            buttonUp = <div className="bond-move-button up" key="up" onClick={this.moveUp}><i className="fa fa-caret-up"></i></div>;
            buttonDown = <div className="bond-move-button down" key="down" onClick={this.moveDown}><i className="fa fa-caret-down"></i></div>;
            buttonDelete = <div className="pull-right"><i className="fa fa-times bond-delete-button" onClick={this.delete}></i></div>;
        }

        return (
            <div className={className} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                <div className="bond-movie-left">
                    {buttonUp}
                    {buttonDown}
                </div>
                <div className="bond-movie-poster">
                    <img src={movie.poster} alt=""/>
                </div>
                <div className="bond-movie-body">
                    {buttonDelete}
                    <div className="bond-movie-title">{movie.title} <span className="bond-movie-year">({movie.year})</span></div>
                    <div>Bond: {movie.bond}</div>
                    <div className="bond-movie-overview">{movie.overview}</div>
                </div>
            </div>
        );
    }
}

BondMovie.renderCounter = 0;


class BondMovieList extends React.Component {

    constructor(props) {
        super(props);

        this.state = { movies: this.props.initialMovies };

        this.moveMovieUp = this.moveMovieUp.bind(this);
        this.moveMovieDown = this.moveMovieDown.bind(this);
        this.deleteMovie = this.deleteMovie.bind(this);
    }

    moveMovieUp(movie) {
        var index = this.state.movies.indexOf(movie);

        this.swapMovies(index, index - 1);
    }

    moveMovieDown(movie) {
        var index = this.state.movies.indexOf(movie);

        this.swapMovies(index, index + 1);
    }

    swapMovies(oldIndex, newIndex) {

        if (newIndex < 0 || newIndex >= this.state.movies.length) {
            return;
        }

        var newList = this.state.movies.slice(0);

        var tmp = newList[newIndex];
        newList[newIndex] = newList[oldIndex];
        newList[oldIndex] = tmp;

        this.setState({ movies: newList });
    }

    deleteMovie(movie) {

        var index = this.state.movies.indexOf(movie);

        var newList = this.state.movies.slice(0);
        newList.splice(index, 1);

        this.setState({ movies: newList });
    }

    render() {

        var movieList = this.state.movies;
        var movieElems = movieList.map(movie => {
            return (
              <BondMovie key={movie.year} movie={movie} onMoveUp={this.moveMovieUp} onMoveDown={this.moveMovieDown} onDelete={this.deleteMovie}/> 
            );
        });

        return (
            <div className="bond-movielist">{movieElems}</div>
        );
    }
}

export default BondMovieList;