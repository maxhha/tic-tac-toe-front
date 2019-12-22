import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { graphql } from 'babel-plugin-relay/macro'

import {
  Heading,
  Page,
  Input,
  Button,
  LoginForm,
} from "styles"

import commitCreateUserMutation from "mutations/createUser"

import {
  setAuthorizationToken,
} from "utils"


interface Props extends RouteComponentProps {
  room: {
    id: string,
    name: string,
  }
}

const Register: React.FC<Props> = ({
  room,
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
          setBusy(false)
        } else {
          setBusy(false)
          console.error(errors)
          return null
        }
      }
    )
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

export default withRouter(Register)
