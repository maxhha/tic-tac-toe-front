import React from "react"
import {
  withRouter,
  RouteComponentProps,
} from "react-router-dom"

import commitEnterRoomMutation from "mutations/enterRoom"
import ViewerContext from "contexts/viewer"

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

const RoomIsActive: React.FC<{ room: IRoom }> = ({ room }) => (
  <Page>
    <Heading.h2>
      Game in room "{room.name}" has already started
    </Heading.h2>
  </Page>
)

const EnterRoom: React.FC<{ room: IRoom }> = ({ room }) => {
  const { update } = React.useContext(ViewerContext)

  React.useEffect(() => {
    commitEnterRoomMutation({
      id: room.id,
    })
      .then(() => update())
      .catch(error => console.error(error))
  }, [
    update,
    room,
  ])

  return <>Please, wait...</>
}

const RoomQuery = RoomQueryContainer(({ room }) => (
  room
  ? room.gameActive
    ? <RoomIsActive room={room}/>
    : <EnterRoom room={room} />
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
