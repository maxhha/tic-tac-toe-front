import React from "react"
import styled from "styled-components"
import { graphql } from "babel-plugin-relay/macro"

import {
  Redirect,
} from "react-router-dom"

import {
  commitMutation,
} from "utils"

import {
  QueryRenderer,
} from "components"

import {
  Page,
  Heading,
} from "styles"

import Board from "./Board"

const ControlButton = styled.button`
  position: fixed;
  top: 100%;
  left: 50%;
  padding: 1rem 4rem;

  background-color: #CEC;
  outline: none;
  border-radius: 0.5rem;

  font-family: monospace;
  color: black;
  font-size: 2rem;

  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }

  transform: translate(-50%, -100%) translateY(-2rem);
`

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

const makeStepMutation = graphql`
  mutation GameMakeStepMutation(
    $input: makeStepInput!
  ) {
    makeStep(input: $input) {
      currentPlayer {
        id
      }
    }
  }
`

interface MutationBoard {
  currentPlayer: { id: string } | null,
}

interface GameBoardProps {
  board: QueryBoard,
  viewer: QueryViewer,
}

interface Position {
  x: number,
  y: number,
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
    commitMutation<{
      makeStep: MutationBoard | null,
    }>(
      {
        mutation: makeStepMutation,
        variables: {
          input: {
            ...position,
          }
        }
      }
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
