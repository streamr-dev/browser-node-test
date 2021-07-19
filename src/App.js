import React from 'react'
import { hri } from 'human-readable-ids'
import { MessageLayer } from 'streamr-client-protocol'

import createBrowserNode from 'streamr-network'

const { StreamMessage, MessageID, MessageRef } = MessageLayer

let reactNode
let publishIntervalRef
let connectionUpdateIntervalRef

class App extends React.Component {
  state = {
    id: this.props.id || hri.random(),
    state: 'Not Connected',
    msgs: this.props.msgs || [
      "Eric: 1",
      "Eric: 2",
      "Eric: 3",
      "Eric: 4",
      "Eric: 5",
      "Eric: 6",
      "Eric: 7",
      "Eric: 8",
      "Petri: 1",
      "Petri: 2",
      "Petri: 3",
      "Petri: 4",
      "Petri: 5",
      "Petri: 6",
      "Petri: 7",
      "Petri: 8",
    ],
    connections: this.props.connections || [],
    sequenceNumber: 0,
    lastTimestamp: null,
    messageChainId: 'message-chain-id'

  }

  componentDidMount() {
    console.log(createBrowserNode)
    reactNode = createBrowserNode({
        id: this.state.id,
        trackers: [ { id: 'tracker', ws: 'ws://127.0.0.1:27777' } ],
        stunUrls: []
    })
    reactNode.start()
    reactNode.subscribe('stream-0', 0)
    reactNode.addMessageListener((message) => {
        const content = JSON.parse(message.serializedContent)
        this.addMsg(`${message.messageId.publisherId}: ${content.sequenceNumber}`)
    })

    publishIntervalRef = setInterval(() => {
      this.publish()
    }, 5000)

    connectionUpdateIntervalRef = setInterval(() => {
      this.setState({
        connections: [...reactNode.streams.streams.get('stream-0::0').inboundNodes]
      })
    }, 2000)
  }

  async componentWillUnmount() {
    if (publishIntervalRef) {
      clearInterval(publishIntervalRef)
    }
    if (connectionUpdateIntervalRef) {
      clearInterval(connectionUpdateIntervalRef)
    }
    await reactNode.stop()

  }

  publish() {
    const timestamp = Date.now()
      const msg = 'Hello world, ' + new Date().toLocaleString()
      const streamMessage = new StreamMessage({
        messageId: new MessageID('stream-0', 0, timestamp, this.state.sequenceNumber, this.state.id, this.state.messageChainId),
        prevMsgRef: this.state.lastTimestamp == null ? null : new MessageRef(this.state.lastTimestamp, this.state.sequenceNumber - 1),
        content: {
            msg,
            noise: 'R E A C T R E A C T R E A C T R E A C T',
            sequenceNumber: this.state.sequenceNumber
        },
      })
      reactNode.publish(streamMessage)
      this.setState({
        sequenceNumber: this.state.sequenceNumber + 1,
        lastTimestamp: timestamp
      })
  }

  addMsg(msg) {
    this.setState(state => {
      if (state.msgs.length >= 25) {
        const list = [...state.msgs]
        list.shift()
        return {
          msgs: [...list, msg]
        }
      } else {
        return {
          msgs: [...state.msgs, msg]
        }
      }
    })
  }

  updateConnections() {

  }

  render() {
    const listMsgs = this.state.msgs.map((msg, index) => <p key={index} className="message">{msg}</p>)
    const listConnections = this.state.connections.map((connection, index) => <p key={index} className="connection">{connection}</p>)
    return (
      <div className="Wrapper">
        <h1>Streamr Network Node Browser Test!</h1>
        <p> Your Browser Node ID:</p>
        <p className="yourId"> { this.state.id }</p>

        <div className="connectionList">
          <p> Connected to:</p>
          { listConnections }
        </div>

        <div className="messageList">
          <p>Last 25 received messages:</p>
          {listMsgs}
        </div>
      </div>
    )
  }
}

export default App
