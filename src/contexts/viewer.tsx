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
  update():void,
  viewer: Viewer | null,
}

const initialValue: ViewerContextValue = {
  update: () => {},
  viewer: null,
}

export const ViewerContext = React.createContext<ViewerContextValue>(initialValue)

export const ViewerContextProvider: React.FC = ({ children }) => {
  const [viewer, setViewer] = React.useState<Viewer | null>(null)
  const busy = React.useRef<Boolean>(false)

  const update = React.useCallback(() => {
      if (busy.current) {
        return
      }
      busy.current = true
      fetchQuery({
        query,
      })
        .then(({ viewer }) => {
          setViewer(viewer)
          busy.current = false
        })
        .catch((error) => {
          console.error(error)
          busy.current = false
        })
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
