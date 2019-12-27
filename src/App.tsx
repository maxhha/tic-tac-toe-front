import React from 'react'
import Room from "pages/Room"
import Login from "pages/Login"
import Register from "pages/Register"
import Game from "pages/Game"

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
        <Route path="/game" component={Game} />
        <Route path="/register/:id" component={Register} />
        <Route path="/:id" component={Room} />
      </Switch>
    </Router>
  )
}

export default App;
