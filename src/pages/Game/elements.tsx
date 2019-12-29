import styled from "styled-components"

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
