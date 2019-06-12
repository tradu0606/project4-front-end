import React, {Component} from 'react';
import Map from "./Map/Map"
import CountryDetails from './Map/CountryDetails'
import { Route, Switch } from 'react-router-dom'
import Bubble from './Bubble/BubbleChart'
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
      <Route exact
						path="/bubble"
						render={(routerProps) => <Bubble {...routerProps} />}>

      </Route>
      </Switch>
    </div>
  );
}
}

export default App;
