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

const query = graphql`
  query RoomQuery($id: ID!) {
    getRoom(id: $id) {
      id
      name
      gameActive
    }
  }
`

interface Room {
  id: string,
  name: string,
  gameActive: string,
}

interface RoomQuery {
  getRoom: Room | null,
}

const NotFound: React.FC = () => (
  <Page>
    <Heading.h2>Cant find room</Heading.h2>
  </Page>
)

const RoomIsActive: React.FC<{room: Room}> = ({ room }) => (
  <Page>
    <Heading.h2>
      Game in room "{room.name}" has already started
    </Heading.h2>
  </Page>
)

const LastRoom: React.FC<{
  room: Room,
}> = ({ room }) => ( // TODO:
  <Page>
    <Heading.h2>
      The game in previous room was not finished.<br/>
      <Link to="/game">Return</Link><br/>
      <Link to={`/register/${room.id}`}>Enter "{room.name}"</Link>
    </Heading.h2>
  </Page>
)

interface Props {
  room: Room,
  viewer: Viewer,
}

const EnterRoom: React.FC<Props> = ({ room, viewer }) => {
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
  }, [])

  return room.gameActive ? <>Game in room is active</> : <>Please, wait...</>
}

const Room: React.FC<Props> = props => {
  const {
    room,
    viewer,
  } = props

  if (viewer.currentRoom === null) {
    return <EnterRoom {...props} />
  } else if (viewer.currentRoom.id === room.id) {
    return room.gameActive ? <Redirect to="/game"/> : <Wait />
  } else {

  }
  return null
}

export default withRouter((
  props: RouteComponentProps<{id: string}>
) => (
  <ViewerContext.Consumer>
    {({ viewer }) => (
      viewer
      ? (
        <QueryRenderer
          query={query}
          variables={{
            id: props.match.params.id,
          }}
          render={({ getRoom: room }: RoomQuery) => (
            room
            ? <Room viewer={viewer} room={room} />
            : <NotFound />
          )}
        />
      )
      : <Redirect to="/" />
    )}
  </ViewerContext.Consumer>
))
