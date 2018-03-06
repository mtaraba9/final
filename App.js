import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      ideas: []
    }
  }

  // Retrieve the list of ideas from Airtable
  getIdeas() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/app6fsipFCqjl1rsm/groceries?&view=Grid%20view";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keyilQMxkUrDnxzUw'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.setState({
        ideas: json.records
      });
    });
  }

  // Runs when the application loads (i.e. the "App" component "mounts")
  componentDidMount() {
    this.getIdeas(); // refresh the list when we're done
  }

  // Upvote an idea
  upvoteIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/app6fsipFCqjl1rsm/groceries/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyilQMxkUrDnxzUw', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          amount: data.fields.amount + 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getIdeas(); // refresh the list when we're done
    });
  }

  // Downvote an idea
  downvoteIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/app6fsipFCqjl1rsm/groceries/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyilQMxkUrDnxzUw', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          amount: data.fields.amount - 1
        }
      })
    };

    // Form the request
    if(data.fields.amount>0){
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getIdeas(); // refresh the list when we're done
    });
  }
  if(data.fields.amount<=0){
  let item = data.fields.item
  alert("You can't buy negative " + item +"!")
  }
}

  // Ignore an idea
  ignoreIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the idea removed
    let newIdeasData = this.state.ideas.slice();
    newIdeasData.splice(rowId, 1);

    // Set state
    this.setState({
      ideas: newIdeasData
    });
  }

  // Delete an idea
  deleteIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the idea removed
    let newIdeasData = this.state.ideas.slice();
    newIdeasData.splice(rowId, 1);

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/app6fsipFCqjl1rsm/groceries/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'Bearer keyilQMxkUrDnxzUw', // replace with your own API key
        'Content-type': 'application/json'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getIdeas(); // refresh the list when we're done
    });
  }

  // The UI for each row of data
  renderRow(data) {
    return (
      <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Body>
          <Text>{data.fields.item}</Text>
        </Body>
        <Right>
          <Text note>{data.fields.amount} </Text>
        </Right>
      </ListItem>
    )
  }

  // The UI for what appears when you swipe right
  renderSwipeRight(data, secId, rowId, rowMap) {
    return (
      <Button full success onPress={() => this.upvoteIdea(data, secId, rowId, rowMap)}>
        <Icon active name="thumbs-up" />
      </Button>
    )
  }

  // The UI for what appears when you swipe left
  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.downvoteIdea(data, secId, rowId, rowMap)}>
        <Icon active name="thumbs-down" />
      </Button>
    )
  }

  render() {
    let rows = this.ds.cloneWithRows(this.state.ideas);
    return (
      <Container>
        <Header>
          <Body>
            <Title>Grocery List</Title>
          </Body>
        </Header>
        <Content>
          <List
            dataSource={rows}
            renderRow={(data) => this.renderRow(data)}
            renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}
