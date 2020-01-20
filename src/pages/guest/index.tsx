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
    {/*
    <Route path="/new" component={NewRoom} />
    */}
    {/*
    <Route exact path="/return" component={Return} />
    <Route path="/enter/:id" component={Return} />
    <Route path="/register/:id" component={Register} />
    */}
    <Route path="/:id" component={Room} />
  </Switch>
)

export default Guest
