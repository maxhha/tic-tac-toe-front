import {
  Position,
  Board,
  View,
} from "./types"

export const getViewFromBoard = (board: Board): View => {
  const SYMBOLS = ["o", "x"]

  const symbols = board.order.reduce(
    (s, { id }, i) => ({ ...s, [id]: SYMBOLS[i % SYMBOLS.length] }),
    {},
  )

  let positions: Position[] = board.possibleSteps
  if (positions.length === 0) {
    positions = board.cells.map(c => c.position)
  }

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
    symbols,
    offset: min,
    size: {
      x: max.x - min.x + 1,
      y: max.y - min.y + 1,
    },
  }
}

export const updateGameBoardView = (view: View, { x, y }: Position): View => {
    const {
      offset,
      size,
    } = view

    if (x === offset.x - 1) {
      offset.x -= 1
      size.x += 1
    }
    if (y === offset.y - 1) {
      offset.y -= 1
      size.y += 1
    }
    if (x === size.x + offset.x) {
      size.x += 1
    }
    if (y === size.y + offset.y) {
      size.y += 1
    }

    return {
      ...view,
      size: { ...size },
      offset: { ...offset },
    }
}
