import React from "react"
import { graphql } from "babel-plugin-relay/macro"

import {
  Redirect,
} from "react-router-dom"

import makeStepMutation from "mutations/makeStep"

import {
  QueryRenderer,
} from "components"

import {
  Page,
  Heading,
} from "styles"

import Board from "./Board"

import {
  ControlButton,
} from "./elements"

const query = graphql`
  query GameQuery {
    board {
      currentPlayer {
        id
      }
    }
    viewer {
      id
    }
  }
`

interface QueryBoard {
  currentPlayer: {
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
  selected: Position | null,
  busy: boolean,
}

const GameBoard: React.FC<GameBoardProps> = (props) => {

  const [state, setState] = React.useState<GameBoardState>({
    selected: null,
    busy: false,
  })

  const {
    selected,
  } = state

  const makeStep = (position: Position) => {
    setState({...state, busy: true})
    makeStepMutation(
      position,
    ).then(
      ({ response, errors}) => {
        if (errors) {
          console.error(errors)
          setState({...state, busy: false})
          return
        }
        if (response && response.makeStep) {
          setState({
            ...state,
            busy: false,
            selected: null,
          })
        } else {
          throw new Error("makeStep response is null")
        }
      }
    ).catch((err) => {
      console.error(err)
      setState({
        ...state,
        busy: false,
      })
    })
  }

  return (
    <>
      <Board
        viewer={props.viewer}
        selected={selected}
        onSelect={(selected) => setState({ ...state, selected})}
      />
      <ControlButton
        onClick={() => selected && makeStep(selected)}
        onTouchEnd={() => selected && makeStep(selected)}
        disabled={!selected || state.busy}
      >
        Make turn
      </ControlButton>
    </>
  )
}

const GamePage: React.FC = () => (
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
