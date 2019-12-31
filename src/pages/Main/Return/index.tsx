import React from "react"
import { Link } from "react-router-dom"
import { withRouter, RouteComponentProps } from "react-router-dom"

import {
  Page,
  Button,
  LoginForm,
  Heading,
} from "styles"

import {
  setAuthorizationToken,
} from "utils"

import commitSetReadyMutation from "mutations/setReady"
import commitExitRoomMutation from "mutations/exitRoom"

interface ReturnProps {
  viewer: {
    name: string,
    currentRoom: {
      id: string,
      name: string,
    },
  },
}

const Return: React.FC<RouteComponentProps & ReturnProps> = ({
  viewer,
  history,
}) => {
  const [busy, setBusy] = React.useState<boolean>(false)

  const handleNewRoomClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    commitSetReadyMutation(false)
      .then(({ errors }) => {
        if (errors)
          throw errors
        return commitExitRoomMutation()
      })
      .then(({ errors }) => {
        if (errors)
          throw errors
        history.push("/new")
      })
      .catch((error) => console.error(error))
      .finally(() => setBusy(false))

    setBusy(true)
  }

  const handleExitClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    commitSetReadyMutation(false)
      .then(({ errors }) => {
        if (errors)
          throw errors
        return commitExitRoomMutation()
      })
      .then(({ errors }) => {
        if (errors)
          throw errors
        setAuthorizationToken("")
        history.push("/signup")
      })
      .catch((error) => console.error(error))
      .finally(() => setBusy(false))

    setBusy(true)

  }

  return (
    <Page>
      <LoginForm>
        <Heading.h2>Hello, { viewer.name }!</Heading.h2>
        <Link to={`/${viewer.currentRoom.id}`}>
          <Button disabled={busy}>
            Return "{viewer.currentRoom.name}"
          </Button>
        </Link>
        <Button
          onClick={handleNewRoomClick}
          disabled={busy}
        >
          Exit room and create new
        </Button>
        <Button
          onClick={handleExitClick}
          disabled={busy}
        >
          Exit user
        </Button>
      </LoginForm>
    </Page>
  )
}

export default withRouter(Return)
