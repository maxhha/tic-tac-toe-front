import React from "react"
import {
  Switch,
  Route,
} from "react-router-dom"

import ReturnMenu from "./Return"
import Game from "./Game"
import RoomMenu from "./Room"

const Room: React.FC = () => (
  <Switch>
    <Route exact path="/" component={ReturnMenu}/>
    <Route path="/game" component={Game}/>
    <Route path="/:id" component={RoomMenu}/>
  </Switch>
)

export default Room
