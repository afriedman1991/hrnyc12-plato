import React from 'react';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import AttendeeMap from './AttendeeMap.jsx';
import AddAttendee from './AddAttendee.jsx';
import Paper from 'material-ui/Paper';
import Lyft from './lyft.jsx';
import { Link } from 'react-router-dom';
import ChatWindow from './ChatWindow.jsx';

class EventMap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
     event: {
        eventName: 'Default',
        eventTime: '12:00',
        eventLatitude: 40.7505,
        eventLongitude: -73.9764
      },
      users : [],
      lyftTime: 0,
      lyftCost: 0,
      userLocation: {
        lat: '',
        lng: ''
      },
      userId: this.getUserId(),
      eventId: this.getEventId(),
      username: this.props.match.params.userName
    }

    this.handleNewAttendee = this.handleNewAttendee.bind(this);
    this.getServerData = this.getServerData.bind(this)
    this.getLyftEstimates = this.getLyftEstimates.bind(this)
    this.getUserLocation();
    this.getLyftEstimates()
  }

  componentDidMount () {
    this.getServerData();
    setInterval(this.getServerData, 1000 * 30);
  }

  handleNewAttendee (attendee) {
    console.log('adding attendee', attendee)
    if(this.isUniqueAttendee(attendee)) {
      axios.post('/user', {
        attendee: attendee,
        eventId: this.state.eventId
      })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
    } else {
      window.alert('Attendee with that phone number already invited!');
    }
  }

  isUniqueAttendee(attendee) {
    return this.state.users.reduce((isUnique, currentAttendee) => {
      return isUnique && attendee.phoneNumber !== currentAttendee.phoneNumber;
    }, true);
  }
  getEventId () {
    return this.props.match.params.number;
  }

  getServerData () {
    axios.get('/event', {
      params: {
        eventId: this.state.eventId
      }
    })
    .then((response) => {
      console.log(response.data);
      console.log(response.data.users[0]);
      this.setState({
        event: response.data.event,
        users: response.data.users
      });
    })
    .catch((error) => console.error(error));
  }

  sendUserLocation () {
    axios.put('/user', {
      userId: this.state.userId,
      lat: this.state.userLocation.lat,
      lng: this.state.userLocation.lng
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.error(error));
  }

  getLyftEstimates() {
    var payload = {
      user : {
        lat : this.state.userLocation.lat,
        lng : this.state.userLocation.lng
      },
      event : {
        lat : this.state.event.eventLatitude,
        lng : this.state.event.eventLongitude
      }
    }

    axios.post('/server/lyft', payload).then((data) => {
      console.log('hiya', this)
      var cost = data.data.cost_estimates[2].estimated_cost_cents_max
      var time = data.data.cost_estimates[2].estimated_duration_seconds
      this.setState({lyftCost: cost, lyftTime: time})
    })
  }

  getUserId () {
    return this.props.location.search.replace('?userId=', '');
  }

  getUserLocation () {
    const geoSuccess = (position) => {
      this.setState({
        userLocation: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }, this.sendUserLocation);
    }

    const geoError = (error) => {
      console.error('Error getting location:', error.message);
    }

    navigator.geolocation.watchPosition(geoSuccess, geoError);
  }

  render () {
    let style = {
      paper : {
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        padding: 5
      }
    }
    const styles = theme => ({
  badge: {
    margin: `0 ${theme.spacing.unit * 2}px`,
  },
})
    return (
      <Paper style={style.paper} zDepth={2}>
        <Link to='/' style={{textDecoration: "none", "color": "#000"}}>
          <h1>
            <RaisedButton style={{"backgroundColor": "#FFF", "paddingLeft": "2%", "paddingRight": "2%", "paddingTop": "1%", "paddingBottom": "1%"}}>Wayn</RaisedButton>
          </h1>
        </Link>
        <h4> Your Event </h4>
        {this.state.users.length ? <AttendeeMap users={this.state.users} event={this.state.event} directions={[]}/>
        : <p>Map will be rendered when someone uploads their location! </p>}
        <AddAttendee addNewAttendee={this.handleNewAttendee} />
        <div style={{float:'right'}}>
        <Lyft getLyftEstimates={this.getLyftEstimates} cost={this.state.lyftCost} time={this.state.lyftTime} />
        </div>
        <ChatWindow eventId={this.state.eventId} username={this.state.username}/>
      </Paper>
    );
  }
}

export default EventMap;
