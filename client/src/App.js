// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Service1 from './Pages/Service1';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/services/spotify-downloader" component={Service1} />
      </Switch>
    </Router>
  );
};

export default App;
