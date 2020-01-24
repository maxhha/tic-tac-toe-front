import React from "react"
import { graphql } from "babel-plugin-relay/macro"

import {
  Link,
} from "react-router-dom"

import makeStepMutation from "mutations/makeStep"

import {
  requestSubscription,
} from "utils"

import {
  User,
  UserWithName,
  Viewer,
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
import UserExited from "./UserExited"

import {
  ControlButton,
  PlayersInfoView,
} from "./elements"

const subscription = graphql`
  subscription GameBoardSubscription {
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

const userExitSubscription = graphql`
  subscription GameBoardUserExitSubscription {
    userExit {
      id
      name
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
  viewer: Viewer,
  onUserExit(e: { user: UserWithName }): void,
  onGameEnd(): void,
}

interface GameBoardState {
  board: Board,
  selected: Position | null,
  busy: boolean,
  view: View,
  // exited?: UserWithName,
}

export const GameBoard: React.FC<GameBoardProps> = (props) => {

  const [state, setState] = React.useState<GameBoardState>({
    board: props.board,
    selected: null,
    busy: false,
    view: getViewFromBoard(props.board),
  })

  React.useEffect(() => {
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
        } else {
          console.error("@game Board is null")
        }
      },
    })

    return dispose
  }, [props.board])

  React.useEffect(() => {
    const { dispose } = requestSubscription({
      subscription: userExitSubscription,
      onNext: ({
        userExit,
      }: {
        userExit: UserWithName | null,
      }) => {
        if (userExit) {
          console.log(`Oh no ${userExit.name} exited room :(`)
          props.onUserExit({ user: userExit })
          // setState((state) => ({
          //   ...state,
          //   exited: userExit,
          // }))
        }
      },
    })
    return dispose
  }, [])

  const makeStep = (position: Position) => {
    setState({...state, busy: true})
    makeStepMutation(
      position,
    ).then(
      ({ makeStep }) => {

        if (makeStep) {
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

  const {
    selected,
  } = state

  const playersInfo = React.useMemo(() => (
    <PlayersInfoView
      players={state.board.order.slice().sort(
        u => u.id === props.viewer.id ? -1 : 1
      )}
      symbols={state.view.symbols}
      current={
        state.board.currentPlayer
        ? state.board.currentPlayer.id
        : undefined
      }
    />
  ), [
    state.board.currentPlayer,
    props.viewer,
    state.board.order,
    state.view.symbols,
  ])

  // if (state.exited) {
  //   return <UserExited user={state.exited} viewer={props.viewer} />
  // }

  return (
    <>
      <BoardView
        board={state.board}
        view={state.view}
        selected={state.selected}
        viewer={props.viewer}
        onSelect={(selected) => setState({ ...state, selected})}
      />
      { playersInfo }
      {
        state.board.winner
        ? (
          <Link to={`/${props.viewer.currentRoom.id}`}>
            <ControlButton
            >
              Restart
            </ControlButton>
          </Link>
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
