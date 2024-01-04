// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect  } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Service1 from './Pages/Service1';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/home" exact component={HomePage} />
        <Route path="/services/spotify-downloader" component={Service1} />
        <Redirect from="/" to="/home" />
      </Switch>
    </Router>
  );
};

export default App;
