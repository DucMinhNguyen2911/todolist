import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './_store';
import { App } from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <BrowserRouter basename='/todolist'>
            <App />
        </BrowserRouter>
    </Provider>
);
