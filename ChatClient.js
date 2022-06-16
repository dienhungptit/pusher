import React from "react";
import Pusher from "pusher-js/react-native";
import { StyleSheet, Text, KeyboardAvoidingView } from "react-native";
import ChatView from "./ChatView";

import pusherConfig from "./pusher.json";

export default class ChatClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.pusher = new Pusher(pusherConfig.key, pusherConfig);

    this.chatChannel = this.pusher.subscribe("QP_chat_22");
    this.chatChannel.bind("MessageSent", (data) => {
      console.log("data",data);
      // this.chatChannel.bind("join", (data) => {
      //   this.handleJoin(data.name);
      // });
      // this.chatChannel.bind("part", (data) => {
      //   this.handlePart(data.name);
      // });
      // this.chatChannel.bind("message", (data) => {
      //   this.handleMessage(data.name, data.message);
      // });
    });

    this.handleSendMessage = this.onSendMessage.bind(this);
  }

  handleJoin(name) {
    const messages = this.state.messages.slice();
    messages.push({ action: "join", name: name });
    this.setState({
      messages: messages,
    });
  }

  handlePart(name) {
    const messages = this.state.messages.slice();
    messages.push({ action: "part", name: name });
    this.setState({
      messages: messages,
    });
  }

  handleMessage(name, message) {
    console.log("data",name, message);

    const messages = this.state.messages.slice();
    messages.push({ action: "message", name: name, message: message });
    this.setState({
      messages: messages,
    });
  }

  componentDidMount() {
    console.log("OK", this.pusher.allChannels())
  }

//   componentWillUnmount() {
//     fetch(`${pusherConfig.restServer}/users/${this.props.name}`, {
//       method: "DELETE",
//     });
//   }

  onSendMessage(text) {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer 279a1a85-6122-41bf-91c3-c2492c37f495"
    );

    var formdata = new FormData();
    formdata.append("receiver_id", "2");
    formdata.append("message", text);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
    fetch("https://qp.sphoton.com/api/v1/chat/send-message", requestOptions)
    // .then(response => response.text())
    // .then(result => console.log(result))
    // .catch(error => console.log('error', error));
  }

  render() {
    const messages = this.state.messages;

    return (
      <ChatView messages={messages} onSendMessage={this.handleSendMessage} />
    );
  }
}
