import React from "react"
import {
  Route,
  Switch,
} from "react-router-dom"

import Main from "./Main"
import Room from "./Room"

const Guest: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Main} />
    <Route path="/:id" component={Room} />
  </Switch>
)

export default Guest
