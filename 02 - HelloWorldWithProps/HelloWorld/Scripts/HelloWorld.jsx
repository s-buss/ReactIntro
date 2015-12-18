var HelloWorld = React.createClass({
    render: function() {
        return (
            <div className="hello" style={{ fontSize: "20px" }}>Hello {this.props.name}!</div>
        );
    }
});