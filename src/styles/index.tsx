import React from "react"
import styled from "styled-components"

export const Page = styled.div`
  width: 100vw;
  height: 100vh;
`

export const Heading = () => null

Heading.h2 = styled.h2`
  margin: 4rem auto;
  font-family: monospace;
  text-align: center;
  font-weight: 400;
`

export const Button = styled.button`
  display: inline-block;
  padding: 0.5rem;
  font-family: monospace;
`

export const Input = styled.input`
  padding: 0.5rem;
  font-family: monospace;
`

const LoginFormInner = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  * {
    margin: 0.5rem;
  }
`

const LoginFormOuter = styled.div`
  padding: 12rem;
  & ${LoginFormInner} {
    margin: auto;
    max-width: 720px;
  }
`

export const LoginForm: React.FC = ({ children }) => (
  <LoginFormOuter>
    <LoginFormInner>
      { children }
    </LoginFormInner>
  </LoginFormOuter>
)
