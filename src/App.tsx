import React from 'react'
import Login from "pages/Login"
import Room from "pages/Room"

import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/game" render={() => <h2>In Game</h2>} />
        <Route path="/:id" component={Room} />
      </Switch>
    </Router>
  )
}

export default App;
