import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { graphql } from 'babel-plugin-relay/macro'
import styled from "styled-components"
import qrcode from "qrcode"

import {
  requestSubscription,
} from "utils"

import commitSetReadyMutation from "mutations/setReady"

import {
  Page,
  Heading,
} from "styles"

const QRCodeImage = styled.img`
  display: block;
  margin: auto;
  width: 20rem;
  height: 20rem;
`

const QRCode: React.FC<{data: string}> = ({ data }) => {
  const [url, setURL] = React.useState<string>("")

  React.useEffect(() => {
    qrcode.toDataURL(data).then(setURL)
  }, [data])

  return (
    <QRCodeImage
      src={url}
    />
  )
}

const subscription = graphql`
  subscription WaitPlayerSubscription {
    waitForOtherUser {
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
        }
      },
    })
    commitSetReadyMutation(true)
    return () => {
      dispose()
      commitSetReadyMutation(false)
    }
  })
  return (
    <Page>
      <Heading.h2>Waiting for other player</Heading.h2>
      <QRCode data={window.location.href}/>
    </Page>
  )
}

export default withRouter(WaitRoom)
