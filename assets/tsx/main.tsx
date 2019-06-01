import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TreeIndexMap} from './components/TreeIndexMap';

const element = document.getElementById('tree-index-map');
if (element) {
    ReactDOM.render(<TreeIndexMap/>, element);
}
