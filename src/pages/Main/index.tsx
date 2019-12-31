import React from "react"
import { graphql } from 'babel-plugin-relay/macro'

import {
  Redirect,
  Switch,
  Route,
} from "react-router-dom"

import {
  QueryRenderer,
} from "components"

import Return from "./Return"

const query = graphql`
  query MainForViewerQuery {
    viewer {
      name
      currentRoom {
        id
        name
      }
    }
  }
`

interface QueryData {
  viewer: {
    name: string,
    currentRoom: {
      id: string,
      name: string,
    } | null,
  } | null,
}

export default () => (
  <QueryRenderer
    query={query}
    render={({ viewer }: QueryData) => (
      viewer
      ? viewer.currentRoom
        ? <Return viewer={{
            name: viewer.name,
            currentRoom: viewer.currentRoom,
          }}
          />
        : <Redirect to="/new" />
      : <Redirect to="/signup"/>
    )}
  />
)
