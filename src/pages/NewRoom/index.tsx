import React from "react"
import { graphql } from 'babel-plugin-relay/macro'

import {
  withRouter,
  RouteComponentProps,
  Redirect,
} from "react-router-dom"


import {
  QueryRenderer,
} from "components"

import {
  Page,
  Input,
  Button,
  LoginForm,
  Heading,
} from "styles"

import commitCreateRoomMutation from "mutations/createRoom"

const query = graphql`
  query NewRoomForViewerQuery {
    viewer {
      name
    }
  }
`

interface CreateRoomProps {
  viewer: {
    name: string,
  }
}

const CreateRoom: React.FC<RouteComponentProps & CreateRoomProps> = ({
  history,
  viewer,
}) => {
  const roomName = React.createRef<HTMLInputElement>()
  const [busy, setBusy] = React.useState<boolean>(false)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (
      !roomName.current
      || roomName.current.value === ""
    )
      return

    commitCreateRoomMutation({
      name: roomName.current.value,
    })
      .then((result) => {
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
        <Heading.h2>Hello, { viewer.name }!</Heading.h2>
        <Input placeholder="Room name" ref = { roomName } />
        <Button onClick={ handleClick } disabled = { busy } > Create room </Button>
      </LoginForm>
    </Page>
  )
}

export default withRouter((props) => (
  <QueryRenderer
    query={query}
    render={(data: { viewer: { name: string } | null }) => (
      data.viewer
      ? (
        <CreateRoom
        {...props}
        viewer={data.viewer}
        />
      )
      : <Redirect exact to="/" />
     )}
  />
))
