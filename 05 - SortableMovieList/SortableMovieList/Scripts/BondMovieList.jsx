var BondMovie = React.createClass({

    //mixins: [ React.addons.PureRenderMixin ],

    getInitialState: function () {
        return { isHovered: false };
    },

    handleMouseEnter: function () {
        this.setState({ isHovered: true });
    },

    handleMouseLeave: function () {
        this.setState({ isHovered: false });
    },

    moveUp: function () {
        // Save the last position of this element for scrolling
        this._lastPos = $(ReactDOM.findDOMNode(this)).offset().top;

        // Let the parent move this entry to a new position.
        this.props.onMove(this.props.index, this.props.index - 1);
    },

    moveDown: function () {
        // Save the last position of this element for scrolling
        this._lastPos = $(ReactDOM.findDOMNode(this)).offset().top;

        // Let the parent move this entry to a new position.
        this.props.onMove(this.props.index, this.props.index + 1);
    },

    // Will be called after rendering this component, but not after the initial rendering.
    // We use it here to see how much the component has moved vertically and adjust the scroll
    // position.
    componentDidUpdate: function() {
        var lastPos = this._lastPos;
        this._lastPos = undefined;

        if (lastPos) {
            var newPos = $(ReactDOM.findDOMNode(this)).offset().top;

            var oldTop = window.scrollY;
            $("html, body").stop().animate({ scrollTop: oldTop + newPos - lastPos }, "250", "linear");
        }
    },

    render: function () {

        console.log("RENDER MOVIE");

        var movie = this.props.movie;

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
});


var BondMovieList = React.createClass({

    getInitialState: function() {
        return { movies: this.props.initialMovies };
    },

    moveMovie: function (oldIndex, newIndex) {
        if (newIndex < 0 || newIndex >= this.state.movies.length) {
            return;
        }

        var newList = this.state.movies.slice(0);

        var tmp = newList[newIndex];
        newList[newIndex] = newList[oldIndex];
        newList[oldIndex] = tmp;

        this.setState({ movies: newList });
    },

    render: function () {

        var movieList = this.state.movies;
        var component = this;
        var movieElems = movieList.map(function (movie, index) {

            var key = movie.year;

            return (
              <BondMovie key={key} index={index} movie={movie} onMove={component.moveMovie}/> 
            );
        });

        return (
            <div className="bond-movielist">{movieElems}</div>
        );
    }
});
