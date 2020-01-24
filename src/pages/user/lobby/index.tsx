import React from "react"
import {
  Switch,
  Route,
} from "react-router-dom"

import Main from "./Main"
import New from "./New"
import Room from "./Room"

const Lobby: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Main} />
    <Route path="/new" component={New}/>
    <Route path="/:id" component={Room}/>
  </Switch>
)

export default Lobby
