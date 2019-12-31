import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { graphql } from 'babel-plugin-relay/macro'

import {
  Page,
  Input,
  Button,
  LoginForm,
} from "styles"

import commitCreateUserMutation from "mutations/createUser"
import commitCreateRoomMutation from "mutations/createRoom"

import {
  setAuthorizationToken,
} from "utils"

const Signup: React.FC<RouteComponentProps> = ({ history }) => {
  const userName = React.createRef<HTMLInputElement>()
  const roomName = React.createRef<HTMLInputElement>()
  const [busy, setBusy] = React.useState<boolean>(false)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (
      !userName.current
      || !roomName.current
      || userName.current.value === ""
      || roomName.current.value === ""
    )
      return

    const name = roomName.current.value
    commitCreateUserMutation({
      name: userName.current.value,
    }).then(
      ({ response, errors }) => {
        if (errors)
          console.error(errors)

        if (response && response.createUser) {
          setAuthorizationToken(response.createUser)
          return commitCreateRoomMutation({ name })
        } else {
          setBusy(false)
          console.error(errors)
          return null
        }
      }
    ).then((result) => {
      if (!result) return
      if (result.errors)
        console.error(result.errors)

      if (result.response && result.response.createRoom) {
        history.push("/"+result.response.createRoom.id)
      } else {
        setBusy(false)
      }
    })
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

export default withRouter(Signup)
