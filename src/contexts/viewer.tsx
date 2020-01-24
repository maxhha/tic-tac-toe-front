import React from "react"
import { graphql } from "babel-plugin-relay/macro"

import {
  fetchQuery
} from "utils"

const query = graphql`
  query viewerQuery {
    viewer {
      id
      name
      currentRoom {
        id
        name
        gameActive
      }
    }
  }
`

export interface Room {
  id: string,
  name: string,
  gameActive: boolean,
}

export interface Viewer {
  id: string,
  name: string,
  currentRoom: Room | null,
}

export interface ViewerContextValue {
  update():Promise<Viewer | null>,
  viewer: Viewer | null,
}

const initialValue: ViewerContextValue = {
  update: async () => null,
  viewer: null,
}

export const ViewerContext = React.createContext<ViewerContextValue>(initialValue)

export const ViewerContextProvider: React.FC = ({ children }) => {
  const [viewer, setViewer] = React.useState<Viewer | null>(null)
  const busy = React.useRef<Promise<Viewer | null> | null>(null)

  const update = React.useCallback(() => {
      if (busy.current) {
        return busy.current
      }
      busy.current = fetchQuery({
        query,
      })
        .then(
          ({ viewer }) => {
            setViewer(viewer)
            busy.current = null
            return viewer
          },
          (error) => {
            console.error(error)
            busy.current = null
          },
        )
      return busy.current
    },
    [
      busy,
      setViewer,
    ],
  )

  React.useEffect(
    () => {
      if (viewer === null) {
        update()
      }
    },
    [
      viewer,
      update,
    ],
  )

  return React.useMemo(() => (
      <ViewerContext.Provider value={{ update, viewer }}>
      { children }
      </ViewerContext.Provider>
    ),
    [
      update,
      viewer,
      children,
    ],
  )
}

export default ViewerContext
