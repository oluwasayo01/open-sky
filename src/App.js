import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import SignIn from './Pages/SignIn'
import Dashboard from './Pages/Dashboard'


function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path='/open-sky' component={SignIn}/>
          <Route path='/dashboard' component={Dashboard} />
        </Switch>
      </Router>

    </div>
  );
}

export default App;
