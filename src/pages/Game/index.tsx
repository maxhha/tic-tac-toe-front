import React from "react"
import { graphql } from "babel-plugin-relay/macro"

import {
  Redirect,
} from "react-router-dom"

import {
  QueryRenderer,
} from "../../components"

import {
  Page,
  Heading,
} from "../../styles"

import Board from "./Board"

const query = graphql`
  query GameQuery {
    board {
      winner {
        id
      }
    }
    viewer {
      id
    }
  }
`

interface GameQuery {
  board: {
    winner: {
      id: string,
    } | null,
  } | null,
  viewer: {
    id: string,
  } | null
}

const GamePage = () => (
  <Page>
    <QueryRenderer
      query={query}
      render={(props: GameQuery) => (
        props.viewer
        ? props.board
          ? <Board viewer={props.viewer}/>
          : <Heading.h2> Not in game </Heading.h2>
        : <Redirect to="/"/>
      )}
    />
  </Page>
)

export default GamePage
