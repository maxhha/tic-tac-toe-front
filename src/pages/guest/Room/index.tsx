import React from "react"

import {
  withRouter,
  RouteComponentProps,
  Redirect,
} from "react-router-dom"

import {
  setAuthorizationToken,
} from "utils"

import ViewerContext from "contexts/viewer"

import commitCreateUserMutation from "mutations/createUser"
import commitEnterRoomMutation from "mutations/enterRoom"

import RoomQueryContainer, {
  Room as IRoom,
} from "containers/roomQuery"

import {
  Heading,
  Page,
  Input,
  Button,
  LoginForm,
} from "styles"

const RoomIsActive: React.FC<{ room: IRoom }> = ({ room }) => (
  <Page>
    <Heading.h2>
      Game in room "{room.name}" has already started
    </Heading.h2>
  </Page>
)

interface Props {
  room: IRoom,
}

const Room: React.FC<Props> = ({
  room,
}) => {
  const [busy, setBusy] = React.useState<boolean>(false)
  const userName = React.createRef<HTMLInputElement>()
  const { update } = React.useContext(ViewerContext)

  const handleClick = () => {
    if (
      !userName.current
      || userName.current.value === ""
    )
      return

    Promise.resolve({ name: userName.current.value})
      .then(async ({ name }) => {
        const { token } = await commitCreateUserMutation({ name })

        setAuthorizationToken(token)

        await commitEnterRoomMutation({
          id: room.id,
        })

        setBusy(false)
        update()
      })
      .catch(error => {
        console.error(error)
        setBusy(false)
      })

    setBusy(true)
  }

  return (
    <Page>
      <LoginForm>
        <Heading.h2>Enter room "{room.name}"</Heading.h2>
        <Input
          placeholder="User name"
          ref={userName}
        />
        <Button
          disabled={busy}
          onClick={handleClick}
        >
          Enter
        </Button>
      </LoginForm>
    </Page>
  )
}

const RoomQuery = RoomQueryContainer(({ room, ...rest }) => (
  room
  ? room.gameActive
    ? <RoomIsActive room={room} />
    : <Room room={room} {...rest} />
  : <Redirect to="/" />
))

export default withRouter((props: RouteComponentProps<{id: string}>) => (
  <RoomQuery
    variables={{
      roomId: props.match.params.id,
    }}
    {...props}
  />
))
