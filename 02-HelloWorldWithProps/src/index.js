import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

class HelloWorld extends React.Component {
    render() {
        return <div className="hello" style={{ fontSize: "20px" }}>Hello {this.props.name}!</div>;
    }
}

ReactDOM.render(<HelloWorld name="Peter"/>, document.getElementById('root'));
