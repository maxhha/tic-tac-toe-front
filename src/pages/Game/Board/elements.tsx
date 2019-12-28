import styled from "styled-components"

export const FieldCell = styled.div`
  position: relative;
  top: 1px;
  left: 1px;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  border: 2px solid gray;
  line-height: 4rem;
`

export const FieldStep = styled(FieldCell)`
  padding: 0;
  background-color: #EEE;
  outline: none;
  cursor: pointer;

  font-family: monospace;
  color: rgba(0,0,0,0.6);
  text-align: center;

  &:hover {
      background-color: #BFB;
  }
  ${props => props.children && (
    "background-color: #BFB;"
  )}
  }
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
`
