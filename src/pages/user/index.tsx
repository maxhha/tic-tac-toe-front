import React from "react"
import {
  Switch,
  Route,
} from "react-router-dom"

import Main from "./Main"
import Game from "./Game"
import Room from "./Room"

const User: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Main} />
    {/*
    <Route path="/new" component={NewRoom} />
    */}
    <Route path="/game" component={Game} />
    {/*
    <Route exact path="/return" component={Return} />
    <Route path="/enter/:id" component={Return} />
    <Route path="/register/:id" component={Register} />
    */}
    <Route path="/:id" component={Room} />
  </Switch>
)

export default User
