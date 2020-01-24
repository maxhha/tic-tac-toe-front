import React from "react"
import {
  Switch,
  Route,
} from "react-router-dom"

import New from "./New"

const Lobby: React.FC = () => (
  <Switch>
    <Route exact path="/" render={() => "go to /new"} />
    <Route path="/new" component={New}/>
  </Switch>
)

export default Lobby
