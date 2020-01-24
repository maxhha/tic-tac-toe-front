import React from "react"

import {
  withRouter,
  RouteComponentProps,
} from "react-router-dom"

import {
  Page,
  Input,
  Button,
  LoginForm,
  Heading,
} from "styles"

import commitCreateRoomMutation from "mutations/createRoom"
import ViewerContext from "contexts/viewer"

const Main: React.FC<RouteComponentProps> = ({
  history,
}) => {
  const { viewer, update: updateUser } = React.useContext(ViewerContext)
  const roomName = React.createRef<HTMLInputElement>()
  const [busy, setBusy] = React.useState<boolean>(false)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (
      !roomName.current
      || roomName.current.value === ""
    )
      return

    Promise.resolve({
      name: roomName.current.value,
    })
      .then(async ({ name }) => {
        const {
          createRoom: {
            id: roomId,
          }
        } = await commitCreateRoomMutation({ name })
        setBusy(false)
        history.push("/"+roomId)
        updateUser()
      })
      .catch(error => {
        console.error(error)
        setBusy(false)
      })

    setBusy(true)
  }
  if (viewer === null){
    throw new Error("Viewer is null")
  }

  return (
    <Page>
      <LoginForm>
        <Heading.h2>Create new room</Heading.h2>
        <Input placeholder="Room name" ref = { roomName } />
        <Button onClick={ handleClick } disabled = { busy } > Create room </Button>
      </LoginForm>
    </Page>
  )
}

export default withRouter(Main)
