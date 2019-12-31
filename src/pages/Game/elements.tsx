import React from "react"
import styled from "styled-components"

import {
  Player,
} from "./types"

export const ControlButton = styled.button`
  position: fixed;
  top: 100%;
  left: 50%;
  padding: 1rem 1rem;
  min-width: 20rem;

  background-color: #CEC;
  outline: none;
  border-radius: 0.5rem;

  font-family: monospace;
  text-align: center;
  color: black;
  font-size: 2rem;

  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }

  transform: translate(-50%, -100%) translateY(-2rem);
`

export const PlayersInfoWrapper = styled.div`
  position: fixed;
  top: 0;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;

  font-family: monospace;
  font-weight: 400;

  & > div {
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
  & span {
    padding: 0 1rem;
    font-size: 4rem;
  }
  & label {
    font-size: 1.75rem;
  }
`

export const PlayerTimerBar = styled.div`
  width: 100%;
  border: 4px solid #3F3;
  border-radius: 4px;
`

interface PlayersInfoProps {
  players: Player[],
  symbols: { [id: string]: string },
  current?: string,
}

export const PlayersInfoView: React.FC<PlayersInfoProps> = ({
  players,
  symbols,
  current,
}) => (
  console.log("rererender") as undefined ||
  <PlayersInfoWrapper>
    {players.map(({ id, name }, index) => (
      <div
        key={id}
        style={{
          textAlign: index === 0 ? "left" : "right",
        }}
      >
        <span>{ symbols[id] }</span>
        <label>{ name }</label>
        {id === current && <PlayerTimerBar />}
      </div>
    ))}
  </PlayersInfoWrapper>
)
