import React from 'react'
import { hri } from 'human-readable-ids'

// import { startNetworkNode } from 'streamr-network'

class App extends React.Component {
  state = {
    id: hri.random(),
    state: 'Not Connected'
  }

  render() {
    return (
      <div className="Wrapper">
        <h1>Streamr Network Node Browser Test!</h1>
        <p> Your Browser Node ID:</p>
        <p style={{fontWeight: "bold"}}> { this.state.id }</p>
        <p style={{marginTop: "50px"}}> Num of connections: { this.state.connections }</p>
      </div>
    )
  }
}

export default App
