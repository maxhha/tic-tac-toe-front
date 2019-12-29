import React from "react"
import { graphql } from "babel-plugin-relay/macro"
import { MapInteractionCSS } from "react-map-interaction"

import {
  fetchQuery,
  requestSubscription,
} from "utils"

import {
  Field,
  FieldCell,
  FieldStep,
} from "./elements"

const query = graphql`
  query BoardQuery {
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
      currentPlayer {
        id
      }
    }
  }
`

interface User<Name = undefined> {
  id: string,
  name: Name,
}

interface Position {
  x: number,
  y: number,
}

interface Cell {
  position: Position,
  owner: User,
}

interface Board {
  cells: Cell[],
  possibleSteps: Position[],
  lastStep: Cell | null,
  order: User[],
  winner: User<string> | null,
  currentPlayer: User | null,
}

const subscription = graphql`
  subscription BoardChangeSubscription {
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
    }
  }
`

interface BoardFromSubscription {
  lastStep: Cell | null,
  possibleSteps: Position[],
  winner: User<string> | null,
  currentPlayer: User | null,
}

interface BoardState {
  board: Board | null,
  offset: Position,
  size: Position,
  symbols: { [key: string]: string },
}

interface BoardProps {
  viewer: { id: string },
  selected: Position | null,
  onSelect(position: Position): void,
}

const updateBounds = (state: BoardState): BoardState => {
    if (
      !state.board
      || !state.board.lastStep
    ) {
      return state
    }
    const { x, y } = state.board.lastStep.position
    let {
      offset: { x: xOffset, y: yOffset },
      size: {x: width, y: height }
    } = state;

    if (x === xOffset - 1) {
      xOffset -= 1;
      width += 1;
    }
    if (y === yOffset - 1) {
      yOffset -= 1;
      height += 1;
    }
    if (x === width + xOffset) {
      width += 1
    }
    if (y === height + yOffset) {
      height += 1
    }
    return {
      ...state,
      size: { x: width, y: height },
      offset: { x: xOffset, y: yOffset },
    }
}

const getOffsetAndSize = (
  positions: Position[],
): {
  offset: Position,
  size: Position,
} => {
  const { min, max } = positions.reduce(
    ({ min, max }, { x, y }) => ({
      min: {
        x: Math.min(x, min.x),
        y: Math.min(y, min.y),
      },
      max: {
        x: Math.max(x, max.x),
        y: Math.max(y, max.y),
      },
    }), {
      min: { x: 0, y: 0},
      max: { x: 0, y: 0},
    }
  )
  return {
    offset: min,
    size: {
      x: max.x - min.x + 1,
      y: max.y - min.y + 1,
    },
  }
}

const Board: React.FC<BoardProps> = ({ viewer, selected, onSelect }) => {
  const [state, setState] = React.useState<BoardState>({
    board: null,
    offset: { x: -1, y: -1 },
    size: { x: 3, y: 3 },
    symbols: {},
  })

  const {
    board,
    offset,
    size,
  } = state

  React.useEffect(() => {
    fetchQuery({ query })
      .then(({ board }: { board: Board | null }) => {
        if (board) {
          setState((state) => ({
            ...state,
            ...getOffsetAndSize(board.possibleSteps),
            board: board,
            symbols: board.order.reduce(
              (store, { id }, index) => (
                {
                  ...store,
                  [id]: index === 0 ? "o" : "x",
                }
              ),
              {},
            ),
          }))
        } else {
          throw new Error("Board is null")
        }
      }).catch(
        (err) => console.error(err)
      )
    const { dispose } = requestSubscription({
      subscription,
      onNext: ({
        waitBoardChange: boardChange,
      }: {
        waitBoardChange: BoardFromSubscription | null
      }) => {
        if (boardChange) {
          setState((state) => (
            state.board
            ? updateBounds({
              ...state,
              board: {
                ...state.board,
                ...boardChange,
                cells: [
                  ...state.board.cells,
                  ...(boardChange.lastStep ? [boardChange.lastStep] : []),
                ],
              },
            })
            : state
          ))
        } else {
          dispose()
          throw new Error("Board change is null")
        }
      },
    })
  }, [])

  return (
    board
    ? (
      <MapInteractionCSS
        containerAsEventTarget={true}
      >
        <Field
          style={{
            gridTemplateColumns: `repeat(${size.x + 2}, 4rem)`,
            gridTemplateRows: `repeat(${size.y + 2}, 4rem)`,
            transform: `translate(${4*offset.x + 2*(size.x - 1)}rem, ${4*offset.y + 2*(size.y - 1)}rem)`,
          }}
        >
          {board.cells.map(({ position: { x, y }, owner: { id } }) => (
            <FieldCell
              key={`${x};${y}:${id}`}
              style={{
                gridColumn: x - offset.x + 2, /* grid starts from 1*/
                gridRow: y - offset.y + 2, /*and add offset for step*/
              }}
              lastStep={
                board.lastStep !== null
                && x === board.lastStep.position.x
                && y === board.lastStep.position.y
              }
            >
              {state.symbols[id]}
            </FieldCell>
          ))}
          {
            board.currentPlayer
            && board.currentPlayer.id === viewer.id
            && board.possibleSteps.map(({x, y}) => (
              <FieldStep
                key={`${x};${y}`}
                style={{
                  gridColumn: x - offset.x + 2, /* grid starts from 1*/
                  gridRow: y - offset.y + 2, /*and add offset for step*/
                }}
                onClick={(e) => {
                    onSelect({ x, y })
                    e.stopPropagation()
                }}
                onTouchEnd={(e) => {
                    onSelect({ x, y })
                    e.stopPropagation()
                }}
                children={
                  selected !== null
                  && x === selected.x
                  && y === selected.y
                  && state.symbols[viewer.id]
                }
              />
            ))
          }
        </Field>
      </MapInteractionCSS>
    ) : (
      <>null</>
    )
  )
}

export default Board
