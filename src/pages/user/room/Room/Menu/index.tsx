import React from "react"

import {
  Link,
} from "react-router-dom"

import {
  Page,
  Button,
  LoginForm,
} from "styles"

import ViewerContext, {
  Room,
} from "contexts/viewer"

import commitSetReadyMutation from "mutations/setReady"
import commitExitRoomMutation from "mutations/exitRoom"
import commitEnterRoomMutation from "mutations/enterRoom"

const Menu: React.FC<{
  targetRoom: Room,
  currentRoom: Room,
}> = ({
  currentRoom,
  targetRoom,
}) => {
  const { update } = React.useContext(ViewerContext)
  const [busy, setBusy] = React.useState<boolean>(false)
  const handleClick = () => {
    setBusy(true)
    Promise.resolve()
      .then(async () => {
        await commitSetReadyMutation(false)
        await commitExitRoomMutation()
        await commitEnterRoomMutation({
          id: targetRoom.id,
        })
        setBusy(false)
        update()
      })
      .catch(error => {
        console.error(error)
        setBusy(false)
      })
  }
  return (
    <Page>
      <LoginForm>
        <Link
          to={`/${currentRoom.id}`}
          onClick={e => busy && e.preventDefault()}
        >
          <Button disabled={busy}>
            Return to "{currentRoom.name}"
          </Button>
        </Link>
        <Button
          disabled={busy}
          onClick={handleClick}
        >
          Enter "{targetRoom.name}"
        </Button>
      </LoginForm>
    </Page>
  )
}

export default Menu
