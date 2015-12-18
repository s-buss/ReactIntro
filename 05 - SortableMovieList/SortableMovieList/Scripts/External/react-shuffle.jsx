/// <reference path="react-with-addons.js"/>
/// <reference path="react-dom.js"/>
/// <reference path="object-assign.js"/>

/* eslint no-unused-vars:0 */
/*global window, document, getComputedStyle*/

//import assign from 'object-assign';
//import tweenState from 'react-tween-state';
//import ReactTransitionGroup from 'react-addons-transition-group';

var ReactTransitionGroup = React.addons.ReactTransitionGroup;

var Clones = React.createClass({
    displayName: "ShuffleClones",

    _childrenWithPositions() {
        var children = [];
        React.Children.forEach(this.props.children, function (child) {
            var style = this.props.positions[child.key];
            var key = child.key;
            children.push(<Clone child={child} style={style} key={key} initial={this.props.initial} fade={this.props.fade} scale={this.props.scale} duration={this.props.duration}/>);
        });
        return children.sort(function(a, b) { return (a.key < b.key) ? -1 : (a.key > b.key) ? 1 : 0; });
    },

    render() {
        return (
            <div className="ShuffleClones">
                <ReactTransitionGroup>
                    {this._childrenWithPositions()}
                </ReactTransitionGroup>
            </div>
        );
    }
});

var Clone = React.createClass({
    mixins: [tweenState.Mixin],

    displayName: "ShuffleClone",

    getInitialState() {
        return {
            top: this.props.style ? this.props.style.top : 0,
            left: this.props.style ? this.props.style.left : 0,
            opacity: 1,
            transform: 1
        }
    },
    componentWillAppear(cb) {
        this.tweenState("opacity", {
            easing: tweenState.easingTypes.easeOutSine,
            duration: this.props.duration,
            beginValue: this.props.initial ? 0 : 1,
            endValue: 1,
            onEnd: cb
        });
    },
    componentWillEnter(cb) {
        this.tweenState("opacity", {
            easing: tweenState.easingTypes.easeOutSine,
            duration: this.props.duration,
            beginValue: 0,
            endValue: 1,
            onEnd: cb
        });
    },
    componentWillLeave(cb) {
        this.tweenState("opacity", {
            easing: tweenState.easingTypes.easeOutSine,
            duration: this.props.duration,
            endValue: 0,
            onEnd: function() {
                try {
                    return cb();
                } catch (e) {
                    // This try catch handles component umounting jumping the gun
                }

                return undefined;
            }
        });
    },
    componentWillReceiveProps(nextProps) {
        this.tweenState("top", {
            easing: tweenState.easingTypes.easeOutSine,
            duration: nextProps.duration,
            endValue: nextProps.style.top
        });
        this.tweenState("left", {
            easing: tweenState.easingTypes.easeOutSine,
            duration: nextProps.duration,
            endValue: nextProps.style.left
        });
    },
    render() {
        var style = {};
        if (this.props.style) {
            style = {
                top: this.getTweeningValue("top"),
                left: this.getTweeningValue("left"),
                opacity: this.props.fade ? this.getTweeningValue("opacity") : 1,
                transform: this.props.scale ? "scale(" + this.getTweeningValue("opacity") + ")" : 0,
                transformOrigin: "center center",
                width: this.props.style.width,
                height: this.props.style.height,
                position: this.props.style.position
            };
        }
        var key = this.props.key;
        return (
            React.cloneElement(this.props.child, { style, key })
        );
    }
});

var Shuffle = React.createClass({

    displayName: "Shuffle",

    propTypes: {
        duration: React.PropTypes.number,
        scale: React.PropTypes.bool,
        fade: React.PropTypes.bool,
        initial: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            duration: 300,
            scale: true,
            fade: true,
            initial: false
        }
    },

    getInitialState() {
        return {
            animating: false,
            ready: false
        };
    },

    componentDidMount() {
        this._makePortal();
        window.addEventListener("resize", this._renderClonesInitially);
    },

    componentWillUnmount() {
        ReactDOM.findDOMNode(this.refs.container).removeChild(this._portalNode);
        window.removeEventListener("resize", this._renderClonesInitially);
    },

    componentWillReceiveProps(nextProps) {
        this._startAnimation(nextProps);
    },

    componentDidUpdate(prevProps) {
        if (this.state.ready === false) {
            this.setState({ready: true}, function () {
                this._renderClonesInitially();
            });
        } else {
            this._renderClonesToNewPositions(this.props);
        }
    },

    _makePortal() {
        this._portalNode = document.createElement("div");
        this._portalNode.style.left = "0px";
        this._portalNode.style.top = "0px";
        this._portalNode.style.position = "absolute";
        ReactDOM.findDOMNode(this.refs.container).appendChild(this._portalNode);
    },

    _addTransitionEndEvent() {
        setTimeout(this._finishAnimation, this.props.duration);
    },

    _startAnimation(nextProps) {
        if (this.state.animating) {
            return;
        }

        var cloneProps = objectAssign({}, nextProps, {
            positions: this._getPositions(),
            initial: this.props.initial,
            fade: this.props.fade,
            scale: this.props.scale,
            duration: this.props.duration
        });
        this._renderClones(cloneProps, function () {
            this._addTransitionEndEvent();
            this.setState({animating: true});
        });
    },

    _renderClonesToNewPositions(props) {
        var cloneProps = objectAssign({}, props, {
            positions: this._getPositions(),
            initial: this.props.initial,
            fade: this.props.fade,
            scale: this.props.scale,
            duration: this.props.duration
        });
        this._renderClones(cloneProps);
    },

    _finishAnimation() {
        this.setState({animating: false});
    },

    _getPositions() {
        var positions = {};
        React.Children.forEach(this.props.children, function (child) {
            var ref = child.key;
            var node = ReactDOM.findDOMNode(this.refs[ref]);
            var rect = node.getBoundingClientRect();
            var computedStyle = getComputedStyle(node);
            var marginTop = parseInt(computedStyle.marginTop, 10);
            var marginLeft = parseInt(computedStyle.marginLeft, 10);
            var position = {
                top: (node.offsetTop - marginTop),
                left: (node.offsetLeft - marginLeft),
                width: rect.width,
                height: rect.height,
                position: "absolute",
                opacity: 1
            };
            positions[ref] = position;
        });
        return positions;
    },

    _renderClonesInitially() {
        var cloneProps = objectAssign({}, this.props, {
            positions: this._getPositions(),
            initial: this.props.initial,
            fade: this.props.fade,
            scale: this.props.scale,
            duration: this.props.duration
        });
        ReactDOM.render(<Clones {...cloneProps}/>, this._portalNode);
        this.setState({ready: true});
    },

    _renderClones(props, cb) {
        ReactDOM.render(<Clones {...props}/>, this._portalNode, cb);
    },

    _childrenWithRefs() {
        return React.Children.map(this.props.children, function(child) {
                return React.cloneElement(child, { ref: child.key });
            }
        );
    },

    render() {
        var showContainer = this.props.initial ? 0 : 1;
        if (this.state.ready) {
            showContainer = 0;
        }
        return (
            <div ref="container" style={{position: "relative"}} {...this.props}>
                <div style={{opacity: showContainer}}>
                    {this._childrenWithRefs()}
                </div>
            </div>
        );
    }
});