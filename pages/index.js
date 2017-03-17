import React from 'react'
import ddp from 'ddp-client';


export default class extends React.Component {
  state = {
    items: []
  }
  componentDidMount() {
    const ddpclient = new ddp({
      ssl  : true,
      autoReconnect : true,
      autoReconnectTimer : 500,
      maintainCollections : true,
      ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
      useSockJs: true,
      url: 'wss://todos-udkjndwlvw.now.sh/websocket'
    });
    
    ddpclient.connect((error, wasReconnect) => {
      if (error) {
        console.log('DDP connection error!');
        return;
      }
    
      if (wasReconnect) {
        console.log('Reestablishment of a connection.');
      }
    
      console.log('connected to a meteor app');
      ddpclient.subscribe(
        'lists.public',                  // name of Meteor Publish function to subscribe to
        [],                       // any parameters used by the Publish function
        () => {             // callback when the subscription is complete
          console.log(ddpclient.collections);
          let items = []; 
          for (var property in ddpclient.collections.lists.items) {
            if (ddpclient.collections.lists.items.hasOwnProperty(property)) {
              items.push(ddpclient.collections.lists.items[property]);
            }
          }
          this.setState({ items });
        }
      );
    });
  }
  renderList = () => {
    return this.state.items.map((item, key) => {
      return (
        <div key={key}>{item.name}</div>
        );
    });
  }
  render () {
    return <div>
      {this.renderList()}
    </div>
  }
}
