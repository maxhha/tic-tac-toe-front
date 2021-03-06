import React from "react"
import {
  withRouter,
  RouteComponentProps,
  Redirect,
} from "react-router-dom"

import ViewerContext from "contexts/viewer"

import Wait from "./Wait"
import Menu from "./Menu"

import {
  Page,
  Heading,
} from "styles"

import RoomQueryContainer, {
  Room as IRoom,
} from "containers/roomQuery"

const NotFound: React.FC = () => (
  <Page>
    <Heading.h2>Cant find room</Heading.h2>
  </Page>
)

const RoomIsActive: React.FC<{room: IRoom}> = ({ room }) => (
  <Page>
    <Heading.h2>
      Game in room "{room.name}" has already started
    </Heading.h2>
  </Page>
)

const Room: React.FC<{ room: IRoom }> = ({ room }) => {
  const { viewer } = React.useContext(ViewerContext)
  if (viewer === null) {
    throw new Error("Viewer is null")
  }
  const { currentRoom } = viewer
  if (currentRoom === null) {
    throw new Error("Current room is null")
  }

  return (
    currentRoom.id === room.id
    ? room.gameActive
      ? <Redirect to="/game"/>
      : <Wait />
    : room.gameActive
      ? <RoomIsActive room={room}/>
      : (
        <Menu
          currentRoom={currentRoom}
          targetRoom={room}
        />
      )
  )
}

const RoomQuery = RoomQueryContainer(({ room }) => (
  room
  ? <Room room={room} />
  : <NotFound />
))

export default withRouter((
  props: RouteComponentProps<{id: string}>
) => (
  <RoomQuery
    variables={{
      roomId: props.match.params.id,
    }}
  />
))
