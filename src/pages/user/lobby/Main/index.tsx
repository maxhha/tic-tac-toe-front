import React from "react"

import {
  Link,
} from "react-router-dom"

import { setAuthorizationToken } from "utils"
import ViewerContext from "contexts/viewer"

import {
  Page,
  Button,
  LoginForm,
  Heading,
} from "styles"

const Main: React.FC = () => {
  const { viewer, update } = React.useContext(ViewerContext)
  if (viewer === null) {
    throw new Error("Viewer is null")
  }

  const handleExit = () => {
    setAuthorizationToken("")
    update()
  }

  return (
    <Page>
      <LoginForm>
        <Heading.h2>Hello, {viewer.name}!</Heading.h2>
        <Link to="/new">
          <Button>
            Create new room
          </Button>
        </Link>
        <Button onClick={handleExit}>
          Exit
        </Button>
      </LoginForm>
    </Page>
  )
}

export default Main
