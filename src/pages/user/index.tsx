import React from "react"

import Lobby from "./lobby"
import Room from "./room"

import Game from "./Game"
import Main from "./Main"
import New from "./New"
import Room2 from "./Room2"

import { Viewer } from "contexts/viewer"

interface Props {
  viewer: Viewer,
}

const User: React.FC<Props> = ({
  viewer: {
    currentRoom: room,
  }
}) => (
    room === null
    ? <Lobby />
    : <Room room={room} />
)

export default User
