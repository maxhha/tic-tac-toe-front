import React from 'react'
import {
  HashRouter as Router,
} from "react-router-dom"

import Return from "pages/Return"

import Main from "pages"

import { ViewerContextProvider } from "contexts/viewer"

const App: React.FC = () => {
  return (
    <ViewerContextProvider>
      <Router>
        <Main/>
      </Router>
    </ViewerContextProvider>
  )
}

export default App;
