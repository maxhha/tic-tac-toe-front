import React from "react"
import { graphql } from "babel-plugin-relay/macro"

import {
  fetchQuery
} from "utils"

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
  order: User,
  winner: User<string> | null,
  currentPlayer: User | null,
}

const Board: React.FC = () => {
  const [board, setBoard] = React.useState<Board | null>(null)
  React.useEffect(() => {
    fetchQuery({ query })
      .then((data: { board: Board | null}) => {
        if (data.board) {
          setBoard(data.board)
        } else {
          throw new Error("Board is null")
        }
      })
  }, [])

  return <> {board ? "Board loaded" : "null"} </>
}

export default Board
