import * as React from 'react'
import './App.css'
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import Home from './containers/pages/Home'
import About from './containers/pages/About'

class App extends React.Component {

  public render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/'><Home /></Route>
          <Route path='/about'><About /></Route>
        </Switch>
      </BrowserRouter>
    )
  }

}

export default App