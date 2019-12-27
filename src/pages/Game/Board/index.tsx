import React from "react"
import { graphql } from "babel-plugin-relay/macro"
import { MapInteractionCSS } from "react-map-interaction"

import {
  fetchQuery
} from "utils"

import {
  Field,
  FieldCell,
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
  lastStep: Cell | null,
  order: User[],
  winner: User<string> | null,
  currentPlayer: User | null,
}

interface BoardState {
  board: Board | null,
  offset: Position,
  size: Position,
}

const updateBounds = ({x, y}: Position, state: BoardState) => {
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

const Board: React.FC = () => {
  const [state, setState] = React.useState<BoardState>({
    board: null,
    offset: { x: -1, y: -1 },
    size: { x: 3, y: 3 },
  })

  const {
    board,
    offset,
    size,
  } = state

  React.useEffect(() => {
    fetchQuery({ query })
      .then((data: { board: Board | null}) => {
        if (data.board) {
          setState({
            ...state,
            board: data.board,
          })
        } else {
          throw new Error("Board is null")
        }
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
            gridTemplateColumns: `repeat(${3 + 2}, 4rem)`,
            gridTemplateRows: `repeat(${3 + 2}, 4rem)`,
            transform: `translate(${4*offset.x + 2*(size.x - 1)}rem, ${4*offset.y + 2*(size.y - 1)}rem)`,
          }}
        >
          {board.cells.map(({ position: { x, y }, owner: { id } }) => (
            <FieldCell
              key={`${x};${y}`}
              style={{
                gridColumn: x - offset.x + 2, /* grid starts from 1*/
                gridRow: y - offset.y + 2, /*and add offset for step*/
              }}
            >
              {id === board.order[1].id ? "x" : "o"}
            </FieldCell>
          ))}
        </Field>
      </MapInteractionCSS>
    ) : (
      <>null</>
    )
  )
}

export default Board
