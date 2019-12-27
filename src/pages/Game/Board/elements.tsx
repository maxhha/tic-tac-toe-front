import styled from "styled-components"

export const FieldCell = styled.div`
  position: relative;
  top: 1px;
  left: 1px;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  border: 2px solid gray;
`

export const Field = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  justify-content: center;
  align-content: center;

  min-height: 100vh;
  padding: 2rem;
  font-family: monospace;
  color: #222;
  font-size: 4rem;
  text-align: center;
  line-height: 3.5rem;
`
