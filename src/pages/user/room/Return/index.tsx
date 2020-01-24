import React from "react"
import {
  Link,
} from "react-router-dom"

import ViewerContext from "contexts/viewer"
import commitExitRoomMutation from "mutations/exitRoom"

import {
  Page,
  Button,
  LoginForm,
  Heading,
} from "styles"

const Return: React.FC = () => {
  const { viewer, update } = React.useContext(ViewerContext)
  const [busy, setBusy] = React.useState<boolean>(false)
  if (viewer === null) {
    throw new Error("Viewer is null")
  }
  const { currentRoom } = viewer
  if (currentRoom === null) {
    throw new Error("Current room is null")
  }

  const handleExitClick = () => {
    setBusy(true)
    commitExitRoomMutation()
      .then(
        () => {
          setBusy(false)
          update()
        },
        errors => {
          console.error(errors)
          setBusy(false)
        }
      )
  }

  return (
    <Page>
      <LoginForm>
        <Heading.h2>Hello, {viewer.name}!</Heading.h2>
        <Link to={`/${currentRoom.id}`} onClick={(e) => busy && e.preventDefault()}>
          <Button disabled={busy}>
              Return "{currentRoom.name}"
          </Button>
        </Link>
        <Button disabled={busy} onClick={handleExitClick}>
          Exit room
        </Button>
      </LoginForm>
    </Page>
  )
}

export default Return
