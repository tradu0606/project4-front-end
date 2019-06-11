import React, {Component} from 'react';
import Map from "./Map/Map"
import CountryDetails from './Map/CountryDetails'
import { Route, Switch } from 'react-router-dom'
import './App.css';

class App extends Component {
  render() {
      return(
    <div className="App">
      <Switch>
      <Route exact
						path="/" 
						render={(routerProps) => <Map {...routerProps} />}>

      </Route>
      <Route exact
						path="/country_details"
						render={(routerProps) => <CountryDetails {...routerProps} />}>

      </Route>
      </Switch>
    </div>
  );
}
}

export default App;
