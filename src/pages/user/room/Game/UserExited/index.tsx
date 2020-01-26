import React from "react"

import {
  withRouter,
  RouteComponentProps,
  Link,
} from "react-router-dom"

import {
  Heading,
  Button,
  LoginForm,
} from "styles"

import ViewerContext from "contexts/viewer"
import commitExitRoomMutation from "mutations/exitRoom"

const UserExited: React.FC<RouteComponentProps & {
  user: {
    name: string,
  }
}> = ({
  user,
  history,
}) => {
  const { viewer, update } = React.useContext(ViewerContext)
  if (viewer === null) {
    throw new Error("Viewer is null")
  }
  const { currentRoom } = viewer
  if (currentRoom === null) {
    throw new Error("Current Room is null")
  }
  const [busy, setBusy] = React.useState<boolean>(false)
  const handleExitRoom = () => {
    setBusy(true)
    commitExitRoomMutation()
      .then(
        () => {
          setBusy(false)
          history.push("/")
          update()
        },
        (error) => {
          console.error(error)
          setBusy(false)
        },
      )
  }
  return (
    <>
      <Heading.h2> {user.name} left room. so you win.</Heading.h2>
      <LoginForm>
        <Link
          to={`/${currentRoom.id}`}
          onClick={(e) => busy && e.preventDefault()}
        >
          <Button disabled={busy}>
            Wait here new game
          </Button>
        </Link>
        <Button
          disabled={busy}
          onClick={handleExitRoom}
        >
          Exit room
        </Button>
      </LoginForm>
    </>
  )
}

export default withRouter(UserExited)
