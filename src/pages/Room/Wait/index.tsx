import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { graphql } from 'babel-plugin-relay/macro'

import {
  requestSubscription,
} from "utils"

import {
  Page,
  Heading,
} from "styles"

const subscription = graphql`
  subscription WaitPlayerSubscription {
    waitForOtherUserEnter {
      gameActive
    }
  }
`

const WaitRoom: React.FC<RouteComponentProps> = ({ history }) => {
  React.useEffect(() => {
    const { dispose } = requestSubscription({
      subscription,
      onNext: (responce) => {
        if (responce.waitForOtherUserEnter.gameActive) {
          history.push("/game")
          dispose()
        }
      },
    })
  }, [])
  return (
    <Page>
      <Heading.h2>Waiting for other player</Heading.h2>
    </Page>
  )
}

export default withRouter(WaitRoom)
