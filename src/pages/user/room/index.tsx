import React from "react"
import {
  Switch,
  Route,
} from "react-router-dom"

import {
  Room as IRoom,
} from "contexts/viewer"

import Wait from "./Wait"

interface Props {
  room: IRoom,
}

const Room: React.FC<Props> = ({ room }) => (
  <Switch>
    <Route path="/game" render={() => "Game"}/>
    <Route path={`/${room.id}`} component={Wait}/>
    <Route path="/:id" render={() => "Menu?"}/>
  </Switch>
)

export default Room
