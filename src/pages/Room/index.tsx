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


const Room: React.FC<RouteComponentProps> = ({ history }) => {
  console.log("start listen")
  React.useEffect(() => {
    requestSubscription(
      subscription,
      {},
      ({responce, dispose}) => {
        console.log(responce)
        console.log(dispose)
      }
    ).then((data) => console.log(data))
  }, [])
  return (
    <Page>
      <Label>Waiting for other player</Label>
    </Page>
  )
}

export default withRouter(Room)
