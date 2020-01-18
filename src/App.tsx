import React from 'react'
import Room from "pages/Room"
import Main from "pages/Main"
import Register from "pages/Register"
import Game from "pages/Game"
import Signup from "pages/Signup"
import NewRoom from "pages/NewRoom"
import Return from "pages/Return"

import ViewerContext, {
  ViewerContextProvider,
} from "contexts/viewer"

import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

const App: React.FC = () => {
  return (
    <ViewerContextProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          {/*
          <Route path="/signup" component={Signup} />
          <Route path="/new" component={NewRoom} />
          */}
          <ViewerContext.Consumer>
            {({ viewer }) => (
              viewer && <Route path="/game" component={Game} />
            )}
          </ViewerContext.Consumer>
          {/*
          <Route exact path="/return" component={Return} />
          <Route path="/enter/:id" component={Return} />
          <Route path="/register/:id" component={Register} />
          */}
          <Route path="/:id" component={Room} />
        </Switch>
      </Router>
    </ViewerContextProvider>
  )
}

export default App;
