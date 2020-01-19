import React from "react"
import { graphql } from 'babel-plugin-relay/macro'
import {
  withRouter,
  RouteComponentProps,
  Redirect,
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

const Main: React.FC = ({}) => (
  null
const NotFound: React.FC = () => (
  <Page>
    <Heading.h2>Cant find room</Heading.h2>
  </Page>
)
)

export default Main;
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
    return <>WAIT</>
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
