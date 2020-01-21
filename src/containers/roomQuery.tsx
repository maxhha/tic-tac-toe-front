import React from "react"
import { graphql } from "babel-plugin-relay/macro"

import {
  QueryRenderer,
} from "components"

const query = graphql`
  query roomQueryForRoomQuery($roomId: ID!) {
    getRoom(id: $roomId) {
      id
      name
      gameActive
    }
  }
`

export interface Room {
  id: string,
  name: string,
  gameActive: string,
}

export interface RoomQuery {
  getRoom: Room | null,
}

export interface RoomQueryVariables {
  roomId: string,
}

const Container: QueryContainerType<RoomQuery, RoomQueryVariables> = render => props => (
  <QueryRenderer
    query={query}
    {...props}
    render={data => render({ ...data })}
  />
)

export default Container
