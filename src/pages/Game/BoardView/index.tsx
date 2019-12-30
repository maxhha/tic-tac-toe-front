import React from "react"
import { MapInteractionCSS } from "react-map-interaction"

import {
  Field,
  FieldCell,
  FieldStep,
} from "./elements"

import {
  User,
  Position,
  Board,
  View,
} from "../types"

interface BoardProps {
  board: Board,
  view: View,
  viewer: User,
  selected: Position | null,
  onSelect(position: Position): void,
}

const BoardView: React.FC<BoardProps> = (props) => {
  const {
    viewer,
    selected,
    onSelect,
    board,
    view: {
      offset,
      size,
      symbols,
    },
  } = props

  return (
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
            highlight={
              (
                board.lastStep !== null
                && x === board.lastStep.position.x
                && y === board.lastStep.position.y
              ) || (
                board.winnerLine !== null
                && board.winnerLine.findIndex(
                  p => p.x === x && p.y === y
                ) >= 0
              )
            }
          >
            {symbols[id]}
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
                && symbols[viewer.id]
              }
            />
          ))
        }
      </Field>
    </MapInteractionCSS>
  )
}

export default BoardView
