import React from "react"
import { graphql } from 'babel-plugin-relay/macro'

import commitCreateUserMutation from "mutations/createUser"
import commitEnterRoomMutation from "mutations/enterRoom"

import {
  withRouter,
  RouteComponentProps,
  Redirect,
} from "react-router-dom"

import {
  QueryRenderer,
} from "components"

import {
  Heading,
  Page,
  Input,
  Button,
  LoginForm,
} from "styles"

import {
  setAuthorizationToken,
} from "utils"

const query = graphql`
  query RegisterForRoomQuery(
    $id: ID!
  ) {
    getRoom(id: $id) {
      id
      name
    }
  }
`

interface Room {
  id: string,
  name: string,
}

interface Props extends RouteComponentProps {
  room: Room,
}

const Register: React.FC<Props> = ({
  room,
  history,
}) => {
  const [busy, setBusy] = React.useState<boolean>(false)
  const userName = React.createRef<HTMLInputElement>()

  const handleClick = () => {
    if (
      !userName.current
      || userName.current.value === ""
    )
      return

    commitCreateUserMutation({
      name: userName.current.value,
    }).then(
      ({ response, errors}) => {
        if (response && response.createUser) {
          setAuthorizationToken(response.createUser)
          return commitEnterRoomMutation({
            id: room.id,
          })
        } else {
          console.error(errors)
          return null
        }
      }
    ).then((result) => {
      setBusy(false)
      if (!result) return
      const { response } = result
      if (response && response.enterRoom) {
        if (response.enterRoom.gameActive) {
          history.push("/game")
        } else {
          history.push(`/${room.id}`)
        }
      } else {
        console.error(result.errors)
      }
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

export default withRouter((routerProps: RouteComponentProps<{id: string}>) => (
  <QueryRenderer
    query={query}
    variables={{
      id: routerProps.match.params.id,
    }}
    render={(props: {getRoom: Room | null}) => (
      props.getRoom
        ? <Register {...routerProps} room={props.getRoom} />
        : <Redirect to="/" />
    )}
  />
))
