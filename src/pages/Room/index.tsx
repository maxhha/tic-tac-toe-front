import React from "react"
import { withRouter, RouteComponentProps, Redirect } from "react-router-dom"
import { graphql } from 'babel-plugin-relay/macro'

import {
  QueryRenderer
} from "components"

import Wait from "./Wait"
import Register from "./Register"

import {
  Page,
  Heading,
} from "styles"

const query = graphql`
  query RoomAndUserQuery($id: ID!) {
    viewer {
      name
      currentRoom {
        id
        name
        gameActive
      }
    }
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

interface Props {
  viewer: {
    name: string,
    currentRoom: Room | null,
  } | null,
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

const Room: React.FC<Props> = ({ viewer, getRoom: room}) => {
  if (room) {
    if (room.gameActive){
      return <RoomIsActive room={room}/>
    } else if (viewer){
      return <>Игрок может зайти в комнату</>
    } else {
      return <Register room={room}/>
    }
  } else {
    return <NotFound />
  }
}

export default withRouter((
  props: RouteComponentProps<{id: string}>
) => (
  <QueryRenderer
    query={query}
    variables={{
      id: props.match.params.id,
    }}
    render={(
      {
        viewer,
        getRoom: room,
      }: Props
    ) => {
      if (viewer && viewer.currentRoom) {
        if (viewer.currentRoom.id === props.match.params.id) {
          console.log(viewer)
          if (viewer.currentRoom.gameActive) {
            return <Redirect to="/game" />
          } else {
            return <Wait />
          }
        } else if (viewer.currentRoom.gameActive) {
          return "Игрок не закончил прошлую игру"
        }
      }
      return <Room getRoom={room} viewer={viewer} />
    }}
  />
))
