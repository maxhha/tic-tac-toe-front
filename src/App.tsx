import React from 'react'
import Login from "pages/Login"

import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
      </Switch>
    </Router>
  )
}

export default App;
