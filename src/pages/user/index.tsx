import React from "react"

import Lobby from "./lobby"
import Room from "./room"

import Main from "./Main"
import Room2 from "./Room2"

import ViewerContext from "contexts/viewer"

const User: React.FC = () => {
  const { viewer } = React.useContext(ViewerContext)
  if (viewer === null) {
    throw new Error("Viewer is null")
  }

  return (
    viewer.currentRoom === null
    ? <Lobby />
    : <Room />
  )
}

export default User
