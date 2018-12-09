import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import BondMovieList from './BondMovieList';

import movies from './Data.json';

ReactDOM.render(<BondMovieList movies={movies}/>, document.getElementById('root'));
