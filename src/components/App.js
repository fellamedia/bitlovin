import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import CRun from '../abis/CRun.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = CRun.networks[networkId]
    if(networkData) {
      const abi = CRun.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Chicks
      for (var i = 1; i <= totalSupply; i++) {
        const chick = await contract.methods.chicks(i - 1).call()
        this.setState({
          chicks: [...this.state.chicks, chick]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      chicks: []
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">Your address:&nbsp;<span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
          </div>
          <hr/>
          <div className="row text-center container">
            { this.state.chicks.map((chick, key) => {
              return(
                <div key={key} className="token-card">
                  <img src="img/placeholder.svg"></img>
                  <p>{Web3.utils.toUtf8(chick.heritage)}&nbsp;&nbsp;&nbsp;<span>{chick.ranking}</span></p>
                  <p>{Web3.utils.toUtf8(chick.stock)}</p>
                  <p>{Web3.utils.toUtf8(chick.gender)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
