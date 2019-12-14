import React from "react"
import { graphql } from 'babel-plugin-relay/macro'
import styled from "styled-components"

import {
  commitMutation,
  setAuthorizationToken,
} from "utils"

const Page = styled.div`
  width: 100vw;
  height: 100vh;
`

const Button = styled.button`
  display: inline-block;
  padding: 0.5rem;
  font-family: monospace;
`

const Input = styled.input`
  padding: 0.5rem;
  font-family: monospace;
`

const LoginFormInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  * {
    margin: 0.5rem;
  }
`

const LoginForm = styled.div`
  padding: 12rem;
  & ${LoginFormInner} {
    margin: auto;
    max-width: 720px;
  }
`

const createUserMutaion = graphql`
  mutation LoginCreateUserMutation(
    $input: createUserInput!
  ) {
    createUser(input: $input)
  }
`

const createRoomMutation = graphql`
  mutation LoginCreateRoomMutation(
    $name: String!
  ) {
    createRoom(name: $name){
      id
    }
  }
`

export const Login: React.FC = () => {
  const userName = React.createRef<HTMLInputElement>()
  const roomName = React.createRef<HTMLInputElement>()
  const [busy, setBusy] = React.useState<boolean>(false)
  const handleClick = () => {
    if (!userName.current || !roomName.current)
      return
    const input = { name: userName.current.value }
    const name = roomName.current.value
    commitMutation(
      createUserMutaion,
      {
        input,
      },
    ).then(
      ({ responce, errors }) => {
        if (errors)
          console.error(errors)

        if (responce) {
          setAuthorizationToken(responce.createUser)
          return commitMutation(
            createRoomMutation,
            { name },
          )
        } else {
          setBusy(false)
          return null
        }
      }
    ).then((result) => {
      if (!result) return
      if (result.errors)
        console.error(result.errors)

      if (result.responce) {
        console.log(result.responce.createRoom)
      }
      setBusy(false)
    })
  }
  return (
    <Page>
      <LoginForm>
        <LoginFormInner>
          <Input placeholder="User name" ref={userName} />
          <Input placeholder="Room name" ref={roomName} />
          <Button onClick={handleClick} disabled={busy}>Create room</Button>
        </LoginFormInner>
      </LoginForm>
    </Page>
  )
}
