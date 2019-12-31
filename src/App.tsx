import React from 'react'
import Room from "pages/Room"
import Main from "pages/Main"
import Register from "pages/Register"
import Game from "pages/Game"
import Signup from "pages/Signup"
import NewRoom from "pages/NewRoom"

import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/signup" component={Signup} />
        <Route path="/new" component={NewRoom} />
        <Route path="/game" component={Game} />
        <Route path="/register/:id" component={Register} />
        <Route path="/:id" component={Room} />
      </Switch>
    </Router>
  )
}

export default App;
