import React from "react"
import { graphql } from "babel-plugin-relay/macro"

import {
  Redirect,
} from "react-router-dom"

import makeStepMutation from "mutations/makeStep"

import {
  requestSubscription,
} from "utils"

import {
  QueryRenderer,
} from "components"

import {
  Page,
  Heading,
} from "styles"

import {
  User,
  UserWithName,
  Position,
  Cell,
  View,
  Board,
} from "./types"

import {
  getViewFromBoard,
  updateGameBoardView,
} from "./utils"

import BoardView from "./BoardView"

import {
  ControlButton,
} from "./elements"

const query = graphql`
  query GameQuery {
    board {
      cells {
        position {
          x
          y
        }
        owner {
          id
        }
      }
      possibleSteps {
        x
        y
      }
      lastStep {
        position {
          x
          y
        }
        owner {
          id
        }
      }
      order {
        id
      }
      winner {
        id
        name
      }
      winnerLine {
        x
        y
      }
      currentPlayer {
        id
      }
    }
    viewer {
      id
    }
  }
`

const subscription = graphql`
  subscription GameBoardChangeSubscription {
    waitBoardChange {
      lastStep {
        position {
          x
          y
        }
        owner {
          id
        }
      }
      possibleSteps {
        x
        y
      }
      currentPlayer {
        id
      }
      winner {
        id
        name
      }
      winnerLine {
        x
        y
      }
    }
  }
`

interface SubscriptionBoard {
  possibleSteps: Position[],
  lastStep: Cell,
  currentPlayer: User | null,
  winner: UserWithName | null,
  winnerLine: Position[] | null,
}

interface GameBoardProps {
  board: Board,
  viewer: User,
}

interface GameBoardState {
  board: Board,
  selected: Position | null,
  busy: boolean,
  view: View,
}

const GameBoard: React.FC<GameBoardProps> = (props) => {

  const [state, setState] = React.useState<GameBoardState>({
    board: props.board,
    selected: null,
    busy: false,
    view: getViewFromBoard(props.board),
  })

  React.useEffect(() => {
    console.log("reconnect")
    const { dispose } = requestSubscription({
      subscription,
      onNext: ({
        waitBoardChange: newBoard,
      }: {
        waitBoardChange: SubscriptionBoard | null,
      }) => {
        if (newBoard) {
          setState((state) => ({
            ...state,
            board: {
              ...state.board,
              ...newBoard,
              cells: [
                ...state.board.cells,
                newBoard.lastStep,
              ],
            },
            view: updateGameBoardView(
              state.view,
              newBoard.lastStep.position,
            )
          }))
        }
      },
    })
    return dispose
  }, [props.board])

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
          setState(state => ({...state, busy: false}))
          return
        }
        if (response && response.makeStep) {
          setState(state => ({
            ...state,
            busy: false,
            selected: null,
          }))
        } else {
          throw new Error("makeStep response is null")
        }
      }
    ).catch((err) => {
      console.error(err)
      setState(state => ({
        ...state,
        busy: false,
      }))
    })
  }

  return (
    <>
      <BoardView
        board={state.board}
        view={state.view}
        selected={state.selected}
        viewer={props.viewer}
        onSelect={(selected) => setState({ ...state, selected})}
      />
      {
        state.board.winner
        ? (
          <ControlButton
          >
            Restart
          </ControlButton>
        ) : (
          <ControlButton
            onClick={() => selected && makeStep(selected)}
            onTouchEnd={() => selected && makeStep(selected)}
            disabled={!selected || state.busy}
          >
            Make turn
          </ControlButton>
        )
      }
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
        board: Board | null,
        viewer: User | null,
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
