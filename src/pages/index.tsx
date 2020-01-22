import React from "react"
import Guest from "./guest"
import User from "./user"

import ViewerContext from "contexts/viewer"

const Main: React.FC = () => {
  const { viewer } = React.useContext(ViewerContext)
  if (viewer === null) {
    return <Guest />
  } else {
    return <User viewer={viewer}/>
  }
}

export default Main
