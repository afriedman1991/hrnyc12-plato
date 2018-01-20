import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Switch, Route, HashRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LandingPage from './components/LandingPage.jsx';
import CreateEvent from './components/CreateEvent.jsx';
import EventMap from './components/EventMap.jsx';
import LoadingPage from './components/LoadingPage.jsx';
import EventList from './components/EventList.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'test',
      imgUrl: ''
    }
    this.landingPageFactory = this.landingPageFactory.bind(this)
    this.grabUrl = this.grabUrl.bind(this)
  }

  grabUrl(url) {
    this.setState({
      imgUrl: url
    })
  }


  landingPageFactory() {
    return(
      <LandingPage testing={this.state.test} grabUrl={this.grabUrl} />
      )
  }

  render () {
    console.log('rthis is in the router state : ', this.state)
    return (
      <div style={{"padding": "30px", "textAlign": "center"}}>
        <main style={{"display": "inlineBlock", "padding": "50px"}}>
          <Switch>
            <Route exact path="/" render={this.landingPageFactory}/>
            <Route exact path="/create" component={CreateEvent}/>
            <Route exact path="/event/:number/:userName" component={EventMap}/>
            <Route exact path="/submit" component={LoadingPage}/>
            <Route exact path="/eventList/:name/:number" component={EventList}/>
          </Switch>
        </main>
      </div>
    );
  }
}


ReactDOM.render((
<MuiThemeProvider>
  <HashRouter>
    <App />
  </HashRouter>
</MuiThemeProvider>
), document.getElementById('app'));
