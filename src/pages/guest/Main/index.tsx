import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"

import {
  Page,
  Input,
  Button,
  LoginForm,
} from "styles"

import ViewerContext from "contexts/viewer"

import commitCreateUserMutation from "mutations/createUser"
import commitCreateRoomMutation from "mutations/createRoom"

import {
  setAuthorizationToken,
} from "utils"

const Main: React.FC<RouteComponentProps> = ({ history }) => {
  const userName = React.createRef<HTMLInputElement>()
  const roomName = React.createRef<HTMLInputElement>()
  const [busy, setBusy] = React.useState<boolean>(false)
  const { update: updateUser } = React.useContext(ViewerContext)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (
      !userName.current
      || !roomName.current
      || userName.current.value === ""
      || roomName.current.value === ""
    )
      return

    Promise.resolve({
      user: userName.current.value,
      room: roomName.current.value,
    })
      .then(async ({ user, room }) => {
        const { createUser: token } = await commitCreateUserMutation({
          name: user,
        })

        setAuthorizationToken(token)
        const { createRoom: { id: roomId } } = await commitCreateRoomMutation({
          name: room,
        })

        history.push("/"+roomId)
        setBusy(false)
        updateUser()
      })
      .catch((errors) => {
        console.error(errors)
        setBusy(false)
      })

    setBusy(true)
  }
  return (
    <Page>
      <LoginForm>
        <Input placeholder= "User name" ref = { userName } />
        <Input placeholder="Room name" ref = { roomName } />
        <Button onClick={ handleClick } disabled = { busy } > Create room </Button>
      </LoginForm>
    </Page>
  )
}

export default withRouter(Main)
