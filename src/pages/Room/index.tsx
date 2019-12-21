import idx from "idx"
import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { graphql } from 'babel-plugin-relay/macro'

import {
  QueryRenderer
} from "components"

import WaitRoom from "./Wait"

const query = graphql`
  query RoomUserQuery {
    viewer {
      name
      currentRoom {
        id
        name
        gameActive
      }
    }
  }
`

const Room: React.FC<RouteComponentProps<{id: string}>> = (props) => (
  <QueryRenderer
    query={query}
    render={({ viewer }) => (
      viewer
        ? props.match.params.id === idx(viewer, _=>_.currentRoom.id)
          ? <WaitRoom />
          : idx(viewer, _=>_.currentRoom.gameActive)
            ? "Игрок находится в другой комнате"
            : "Игрок может зайти в комнату"
        : "Игроку нужно зарегаться перед тем как зайти в комнату"
    )}
  />
)

export default withRouter(Room)
