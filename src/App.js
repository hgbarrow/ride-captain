import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import UserInput from './UserInput';
import Lyft from './Lyft';
import Uber from './Uber';
import TimeSeriesPlot from './TimeSeriesPlot';

//var SimpleForm = require('./SimpleForm.js')

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {start: {},
                  end: {},
                  hasAddress: false,
                  timeSeriesData: [
                    ['time'],
                    ['uber'],
                    ['lyft']
                  ],
                };
    this.waitingForOther = true;
    this.refreshInterval = 30000;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewLyftData = this.handleNewLyftData.bind(this);
    this.handleNewUberData = this.handleNewUberData.bind(this);
  }
  handleSubmit(start, end, startAddress, endAddress){
    this.setState({start: start, 
                   end: end,
                   hasAddress:true});
  }
  handleNewUberData(cost){
    console.log('newUber');
    var time = new Date();
    var timeString = time.getHours() + ":" + time.getMinutes() + ':' + time.getSeconds();
    var data = this.state.timeSeriesData.slice();
    data[1].push(cost);
    if(!this.waitingForOther){
      data[0].push(timeString)
      this.setState(function(){
        return {timeSeriesData: data}
      });
      this.waitingForOther = true;
    } else {
      this.waitingForOther = false;
    }
  }
  handleNewLyftData(cost){
    console.log('newLyft')
    var time = new Date();
    var timeString = time.getHours() + ":" + time.getMinutes() + ':' + time.getSeconds();
    var data = this.state.timeSeriesData.slice();
    data[2].push(cost);
    if(!this.waitingForOther){
      data[0].push(timeString)
      this.setState(function(){
        return {timeSeriesData: data}
      });
      this.waitingForOther = true;
    } else {
      this.waitingForOther = false;
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Ride Captain</h1>
        </header>
        <UserInput onSubmit={this.handleSubmit}/>
        {this.state.timeSeriesData[0].length > 1 && 
          <TimeSeriesPlot data={this.state.timeSeriesData}/>
        }
        {this.state.hasAddress &&
          <div>
          <h3>Start: {this.state.start.address}</h3>
          <h3>End: {this.state.end.address}</h3>
          <div className='service-info'>
            <Uber start={this.state.start} 
                  end={this.state.end}
                  onNewData={this.handleNewUberData}
                  refreshEvery={this.refreshInterval}/>
            <Lyft start={this.state.start} 
                  end={this.state.end}
                  onNewData={this.handleNewLyftData}
                  refreshEvery={this.refreshInterval}/>
          </div>
          </div>
        }
        
      </div>
    );
  }
}

export default App;
