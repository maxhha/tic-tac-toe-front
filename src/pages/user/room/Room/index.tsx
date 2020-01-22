import React from "react"
import { graphql } from 'babel-plugin-relay/macro'
import {
  withRouter,
  RouteComponentProps,
  Redirect,
  Link,
} from "react-router-dom"

import {
  QueryRenderer
} from "components"

import commitSetReadyMutation from "mutations/setReady"
import commitExitRoomMutation from "mutations/exitRoom"
import commitEnterRoomMutation from "mutations/enterRoom"
import ViewerContext, {
  Viewer,
} from "contexts/viewer"

import Wait from "./Wait"

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

const LastRoom: React.FC<{
  room: IRoom,
}> = ({ room }) => ( // TODO:
  <Page>
    <Heading.h2>
      The game in previous room was not finished.<br/>
      <Link to="/game">Return</Link><br/>
      <Link to={`/register/${room.id}`}>Enter "{room.name}"</Link>
    </Heading.h2>
  </Page>
)

interface EnterRoomProps {
  room: IRoom,
  viewer: Viewer,
}

const EnterRoom: React.FC<EnterRoomProps> = ({ room, viewer }) => {
  const { update: updateUser } = React.useContext(ViewerContext)

  React.useEffect(() => {
    if (!room.gameActive) {
      Promise.resolve()
        .then(async () => {
          if (viewer.currentRoom) {
            await commitSetReadyMutation(false)
            await commitExitRoomMutation()
          }
          await commitEnterRoomMutation({
            id: room.id,
          })
          updateUser()
        })
    }
  }, [
    updateUser,
    viewer,
    room,
  ])

  return room.gameActive ? <>Game in room is active</> : <>Please, wait...</>
}

const Room: React.FC<{ room: IRoom }> = ({ room }) => {

  const { viewer } = React.useContext(ViewerContext)

  if (viewer === null) {
    throw new Error("Viewer is null")
  }

  if (viewer.currentRoom === null) {
    return <EnterRoom room={room} viewer={viewer} />
  } else if (viewer.currentRoom.id === room.id) {
    return room.gameActive ? <Redirect to="/game"/> : <Wait />
  } else {

  }
  return null
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
