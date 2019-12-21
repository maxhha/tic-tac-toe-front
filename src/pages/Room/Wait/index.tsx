import React from "react"
import styled from "styled-components"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { graphql } from 'babel-plugin-relay/macro'

import {
  requestSubscription,
} from "utils"

import {
  Page,
} from "styles"

const Label = styled.h2`
  margin: 4rem auto;
  font-family: monospace;
  text-align: center;
  font-weight: 400;
`

const subscription = graphql`
  subscription RoomWaitPlayerSubscription {
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
      <Label>Waiting for other player</Label>
    </Page>
  )
}

export default withRouter(WaitRoom)
