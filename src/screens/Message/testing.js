import React, { Component } from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatMessage: "",
            chatMessages: [],
            ws:null
        };
    }

    componentDidMount() {
        this.reconnect = !!this.props.reconnect
        this._handleWebSocketSetup()
    }
    componentWillUnmount () {
        this.reconnect = false
        this.state.ws.close()
    }
    _handleWebSocketSetup = () => {
        const ws = new WebSocket('ws://data-solution.expressloan.info:8081?access_token={{token}}')
        ws.onopen = () => {
            this.props.onOpen && this.props.onOpen()
        }
        ws.onmessage = (event) => { console.log(event) }
        ws.onerror = (error) => { this.props.onError && this.props.onError(error) }
        ws.onclose = () => this.reconnect ? this._handleWebSocketSetup() : (this.props.onClose && this.props.onClose())
        this.setState({ws})
    }
    submitChatMessage() {
        this.state.ws.send(this.state.chatMessage)
        this.setState({ chatMessage: "" });
    }

    render() {
        const chatMessages = this.state.chatMessages.map(chatMessage => (
            <Text key={chatMessage}>{chatMessage}</Text>
        ));
        return (
            <View style={styles.container}>
                <TextInput
                    style={{ height: 40, borderWidth: 2 }}
                    autoCorrect={false}
                    value={this.state.chatMessage}
                    onSubmitEditing={() => this.submitChatMessage()}
                    onChangeText={chatMessage => {
                        this.setState({ chatMessage });
                    }}
                />
                {chatMessages}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5FCFF"
    }
});
