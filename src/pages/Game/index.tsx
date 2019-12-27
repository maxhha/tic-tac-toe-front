import React from "react"
import { graphql } from "babel-plugin-relay/macro"

import {
  Page,
} from "../../styles"

import Board from "./Board"

const GamePage = () => (
  <Page>
    <Board />
  </Page>
)

export default GamePage
