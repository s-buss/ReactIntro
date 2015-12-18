var HelloWorld = React.createClass({
    getInitialState: function() {
        return { isHovered: false, dummy: 17 };
    },

    handleMouseEnter: function() {
        this.setState({ isHovered: true });
    },

    handleMouseLeave: function () {
        this.setState({ isHovered: false });
    },

    render: function () {

        var className = "hello";
        var additionalText = undefined;
        if (this.state.isHovered) {
            className = "hello hovered";
            additionalText = <span>&nbsp;(hovered)</span>;
        }

        return (
            <div className={className} style={{ fontSize: "20px" }} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                Hello {this.props.name}!
                {additionalText}
            </div>
        );
    }
});