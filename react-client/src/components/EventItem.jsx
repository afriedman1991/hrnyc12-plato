;import React from 'react'
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Button from 'material-ui/FlatButton';

class EventItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      eventName: this.props.evt.eventName,
      attendees: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.attendees.length === 0) {
      console.log('no attendees')
    } else {
      this.setState({
        attendees: nextProps.attendees
      });
    }
  }

  render() {
    return (
      <div style={{"paddingTop": "2%"}}>
        <Card style={{"width": "30vw", "transitionDuration": "0.3s", "margin": "auto", "padding": "10px"}}>
          <CardTitle title={this.state.eventName} subtitle="Attendees"></CardTitle>
            {this.state.attendees.map((item, key) => {
              if (item.firstName === null || item.lastName === null || item.phoneNumber === null) {
                console.log('whoops');
              } else {
                return (
                  <div style={{"textAlign": "left"}} key={key}>
                    <CardHeader style={{"width": "100%"}} avatar="https://marriedwiki.com/uploads/bio/gangsta-grandma.jpg" title={item.firstName + ' ' + item.lastName + ' | ' + item.phoneNumber}></CardHeader>
                  </div>
                )
              }
            })}
        </Card>
      </div>
    )
  }
}

export default EventItem;
