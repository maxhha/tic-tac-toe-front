import React from "react"
import styled from "styled-components"
import { graphql } from 'babel-plugin-relay/macro'
import {
  Page,
} from "styles"

const Label = styled.h2`
  margin: 4rem auto;
  font-family: monospace;
  text-align: center;
  font-weight: 400;
`

const Room: React.FC = () => {
  return (
    <Page>
      <Label>Waiting for other player</Label>
    </Page>
  )
}

export default Room
