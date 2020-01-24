import React from "react"
import {
  Switch,
  Route,
} from "react-router-dom"

import Game from "./Game"
import RoomMenu from "./Room"

const Room: React.FC = () => (
  <Switch>
    <Route exact path="/" render={() => "MMenu?"}/>
    <Route path="/game" component={Game}/>
    <Route path="/:id" component={RoomMenu}/>
  </Switch>
)

export default Room
