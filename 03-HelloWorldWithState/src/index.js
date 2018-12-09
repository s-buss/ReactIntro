import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import './HelloWorld.css';

class HelloWorld extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isHovered: false, dummy: 17 };
    }

    handleMouseEnter() {
        this.setState({ isHovered: true });
    }

    handleMouseLeave() {
        this.setState({ isHovered: false });
    }

    render() {

        var className = "hello";
        var additionalText = undefined;
        if (this.state.isHovered) {
            className = "hello hovered";
            additionalText = <span>&nbsp;(hovered)</span>;
        }

        return (
            <div className={className} style={{ fontSize: "20px" }} onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>
                Hello {this.props.name}!
                {additionalText}
            </div>
        );
    }
}

ReactDOM.render(<HelloWorld name="Peter"/>, document.getElementById('root'));
