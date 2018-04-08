// Default export from a module
import React from 'react';

// Individual method exports from a module
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import configureStore from './reducers/store';
import Template from './components/Template';
import './shared/loader.scss';
import './shared/cssStyles.css';

const Store = configureStore();

const renderApp = (Component) => {
  render(
    <AppContainer>
      <Provider store={Store}>
        <div>
          <Component />
        </div>
      </Provider>
    </AppContainer>,
    document.querySelector('#react-app'),
  );
};

renderApp(Template);

if (module && module.hot) {
  module.hot.accept('./components/Template', () => {
    renderApp(Template);
  });
}
