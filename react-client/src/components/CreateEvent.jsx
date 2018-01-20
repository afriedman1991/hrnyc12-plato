import React from 'react';
import axios from 'axios';
import AddAttendee from './AddAttendee.jsx';
import AttendeeList from './AttendeeList.jsx';
import MapWithSearchBox from './MapWithSearch.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

class CreateEvent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      eventName: '',
      location: {
        lat: '',
        lng: '',
      },
      organizerFirstName: '',
      organizerLastName: '',
      organizerPhoneNumber: '',
      time: '',
      attendees: [],
      locale: null,
      submitted: false
    }

    this.handleEventNameChange = this.handleEventNameChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewAttendee = this.handleNewAttendee.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleDeleteAttendee = this.handleDeleteAttendee.bind(this);
    this.setLocale = this.setLocale.bind(this);
  }

  handleDeleteAttendee (attendee) {
    let deleteIndex = this.state.attendees.indexOf(attendee);
    this.state.attendees.splice(deleteIndex, 1);
    this.setState({
      attendees: this.state.attendees
    })
  }

  handleLocationChange (location) {
    this.setState({
      location: location
    });
  }

  handleEventNameChange (e) {
    this.setState({
      eventName: e.target.value
    });
  }

  handleTimeChange (e) {
    this.setState({
      time: e.target.value
    });
  }

  setLocale(locale) {
    this.setState({
      locale: locale
    }, () => {axios.post('/opentable', {locale: locale}).then((response) => {
      this.setState({resLink: response.data.restaurants[0].reserve_url})
    })
  })}

  handleSubmit (e) {
    e.preventDefault();
    if (this.state.attendees.length > 0) {
      this.setState({
        submitted: true
      }, () => {
        let infoToPost = this.state;

        // Add organizer as an attendee of event, then remove those properties from infoToPost
        infoToPost.attendees.push({
          firstName: this.state.organizerFirstName,
          lastName: this.state.organizerLastName,
          phoneNumber: this.state.organizerPhoneNumber
        });

        delete infoToPost.organizerFirstName;
        delete infoToPost.organizerLastName;
        delete infoToPost.organizerPhoneNumber;

        console.log('Submitting, contents of state:', infoToPost);
        axios.post('/event', this.state)
        .then((response) => this.props.history.push('/submit'))
        .catch((error) => {
          console.log(this.props);;
        });
      });
    } else {
      window.alert(`Don't forget to invite someone!`);
    }
  }

  handleNewAttendee (attendee) {
    if(this.isUniqueAttendee(attendee)) {
      this.setState({
        attendees: [...this.state.attendees, attendee]
      });
    } else {
      window.alert('Attendee with that phone number already invited!');
    }
  }

  isUniqueAttendee(attendee) {
    return this.state.attendees.reduce((isUnique, currentAttendee) => {
      return isUnique && attendee.phoneNumber !== currentAttendee.phoneNumber;
    }, true);
  }

  handleFirstNameChange (e) {
    this.setState({
      organizerFirstName: e.target.value
    });
  }

  handleLastNameChange (e) {
    this.setState({
      organizerLastName: e.target.value
    });
  }

  handlePhoneNumberChange (e) {
    this.setState({
      organizerPhoneNumber: e.target.value
    });
  }

  render () {
    let style = {
      paper : {
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        padding: 5,
        marginLeft: '11%'
      },
      textField: {
        marginLeft: 20
      }
    };

    return (
      <Paper style={style.paper} zDepth={2}>
        <Link to='/' style={{textDecoration: "none", "color": "#000"}}>
          <h1>
            <RaisedButton style={{"backgroundColor": "#FFF", "paddingLeft": "2%", "paddingRight": "2%", "paddingTop": "1%", "paddingBottom": "1%"}}>Wayn</RaisedButton>
          </h1>
        </Link>
        <h4> Event Details </h4>
        <form onSubmit={this.handleSubmit}>
        <TextField value={this.state.eventName} onChange={this.handleEventNameChange} required={true} floatingLabelText="Event name" style={style.textField} underlineShow={true} />

          <label>
            Time:
            <input type="time" value={this.state.time} onChange={this.handleTimeChange} required/>
          </label>
          <a href={this.state.resLink} style={{paddingleft: '30px'}}>Book a reservation!</a>
          <img style={{width:'80px', height:'auto', paddingTop: '10px', paddingLeft:'15px'}} src='https://assets.brandfolder.com/o3omnr-9qhjhc-eg4b40/v/411576/view.png'/>
          <br/>
          <MapWithSearchBox getEventCoordinate={this.handleLocationChange} setLocale={this.setLocale}/>

          <br/>
          <br/>
          <h5>Organizer Info:</h5>

          <TextField value={this.state.organizerFirstName} onChange={this.handleFirstNameChange} required={true} floatingLabelText="First name" style={style.textField} underlineShow={true} />
          <TextField value={this.state.organizerLastName} onChange={this.handleLastNameChange} required={true} floatingLabelText="Last name" style={style.textField} underlineShow={true} />
          <TextField value={this.state.organizerPhoneNumber} onChange={this.handlePhoneNumberChange} required={true} floatingLabelText="Phone number" style={style.textField} underlineShow={true} />
          <RaisedButton type="submit" label="Create Event" onClick={this.handleSubmit} primary={true}/>
          {this.state.submitted ? <CircularProgress /> : ''}

        </form>
        <br/>
            <AddAttendee addNewAttendee={this.handleNewAttendee} />
            <AttendeeList attendees={this.state.attendees} deleteAttendee={this.handleDeleteAttendee}/>
      </Paper>
    );
  }
}

export default CreateEvent;
