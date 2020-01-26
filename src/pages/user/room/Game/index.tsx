import React from "react"
import { graphql } from "babel-plugin-relay/macro"

import {
  Redirect,
} from "react-router-dom"

import {
  QueryRenderer,
  GameBoard,
} from "components"

import {
  Viewer,
  Board,
  UserWithName,
} from "components/GameBoard/types"

import {
  Page,
} from "styles"

import UserExited from "./UserExited"

const query = graphql`
  query GameQuery {
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
      possibleSteps {
        x
        y
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
        name
      }
      winner {
        id
        name
      }
      winnerLine {
        x
        y
      }
      currentPlayer {
        id
      }
    }
    viewer {
      id
      currentRoom {
        id
      }
    }
  }
`


const GameQuery: React.FC<{
  onUserExit(e: { user: UserWithName }):void,
}> = (props) => (
  <QueryRenderer
    query={query}
    render={({
      viewer,
      board,
    }: {
      board: Board | null,
      viewer: Viewer | null,
    }) => (
      viewer
      ? board
        ? (
          <GameBoard
            viewer={viewer}
            board={board}
            {...props}
          />
        )
        : <Redirect to={`/${viewer.currentRoom.id}`} />
      : <Redirect to="/" />)
    }
  />
)

const GamePage: React.FC = () => {
  const [exited, setExited] = React.useState<{ user: UserWithName } | null>(null)

  return (
    <Page>
      {
        exited
        ? <UserExited {...exited}/>
        : (
          <GameQuery
            onUserExit={setExited}
          />
        )
      }
    </Page>
  )
}

export default GamePage
