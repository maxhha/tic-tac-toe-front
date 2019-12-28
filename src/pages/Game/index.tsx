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

interface QueryBoard {
  winner: {
    id: string,
  } | null,
}

interface QueryViewer {
  id: string,
}

interface GameBoardProps {
  board: QueryBoard,
  viewer: QueryViewer,
}

interface GameBoardState {
  selected: { x: number, y: number } | null,
}

const GameBoard: React.FC<GameBoardProps> = (props) => {

  const [state, setState] = React.useState<GameBoardState>({
    selected: null,
  })

  const {
    selected,
  } = state

  return (
    <>
      <Board
        viewer={props.viewer}
        selected={selected}
        onSelect={(selected) => setState({ ...state, selected})}
      />
    </>
  )
}

const GamePage = () => (
  <Page>
    <QueryRenderer
      query={query}
      render={({
        viewer,
        board,
      }: {
        board: QueryBoard | null,
        viewer: QueryViewer | null,
      }) => (
        viewer
        ? board
          ? (
            <GameBoard
              viewer={viewer}
              board={board}
            />
          ): <Heading.h2> Not in game </Heading.h2>
        : <Redirect to="/" />
      )}
    />
  </Page>
)

export default GamePage
