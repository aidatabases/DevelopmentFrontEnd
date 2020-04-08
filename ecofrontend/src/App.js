import React from 'react'
import Homepage from './Homepage'
import Header from './header'
import AutoComo from './Autocomo'
import Tab from './Tab'
import App4 from './App4';
import Chart from './cc'
import {BrowserRouter as Router,Route,Switch,Link} from "react-router-dom";

function App(){
  return(
    <Router>
      <div>

        <div style={{height:100}}>
          <Header/>
        </div>
        <div style={{backgroundColor:"black",height:200}}>
          <AutoComo/>
        </div>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/:level2key" component={App4} />
          <Route exact path="/chart/:lev2/:lev3/:lev4/:lev5" component={Chart} />
        </Switch>
    </div>
  </Router>
  
  )
}

export default App
