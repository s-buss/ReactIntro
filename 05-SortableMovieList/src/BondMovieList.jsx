import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './BondMovieList.css';

// Replace PureComponent here with Component and verify in the console window that then
// the whole movie list is rendered after moving a movie up or down. With PureComponent
// as base class, the system recognizes that most of the movie elements stay unchanged
// and need no rendering.
class BondMovie extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = { isHovered: false };

        // Bind event handling methods to this
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
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
        this.props.onMove(this.props.index, this.props.index - 1);
    }

    moveDown() {
        // Save the last position of this element for scrolling
        this._lastPos = $(ReactDOM.findDOMNode(this)).offset().top;

        // Let the parent move this entry to a new position.
        this.props.onMove(this.props.index, this.props.index + 1);
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

        console.log(`Rendering Movie ${movie.title}`);

        var className = "bond-movie";
        var buttonUp = undefined;
        var buttonDown = undefined;
        if (this.state.isHovered) {
            className = "bond-movie bond-movie-hovered";
            buttonUp = <div className="bond-move-button up" key="up" onClick={this.moveUp}><i className="fa fa-caret-up"></i></div>;
            buttonDown = <div className="bond-move-button down" key="down" onClick={this.moveDown}><i className="fa fa-caret-down"></i></div>;
        }

        return (
            <div className={className} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                <div className="bond-movie-left">
                    {buttonUp}
                    <div className="bond-movie-index">{this.props.index + 1}</div>
                    {buttonDown}
                </div>
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

class BondMovieList extends React.PureComponent {


    constructor(props) {
        super(props);

        this.state = { movies: this.props.initialMovies };

        this.moveMovie = this.moveMovie.bind(this);
    }

    moveMovie(oldIndex, newIndex) {
        if (newIndex < 0 || newIndex >= this.state.movies.length) {
            return;
        }

        var newList = this.state.movies.slice(0);

        var tmp = newList[newIndex];
        newList[newIndex] = newList[oldIndex];
        newList[oldIndex] = tmp;

        this.setState({ movies: newList });
    }

    render() {

        var movieList = this.state.movies;
        var movieElems = movieList.map((movie, index) => {

            var key = movie.year;

            return (
              <BondMovie key={key} index={index} movie={movie} onMove={this.moveMovie}/> 
            );
        });

        return (
            <div className="bond-movielist">{movieElems}</div>
        );
    }
}

export default BondMovieList;