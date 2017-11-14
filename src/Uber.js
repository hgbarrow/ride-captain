import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import DisplayTable from './DisplayTable';


class Uber extends React.Component{
    constructor(props) {
        super(props)

        this.state = {eta: [],
                      cost: []}
        this.updateInfo = this.updateInfo.bind(this);
    }
    updateInfo() {
        axios.post('/uber/eta', {start: this.props.start})
            .then(res => {
                this.setState({ eta: res.data.times})
            })

        axios.post('/uber/cost', {start: this.props.start, end: this.props.end})
            .then(res => {
                var prices = res.data.prices;
                prices.sort(function(a, b){ return a.high_estimate - b.high_estimate})
                this.setState({ cost: res.data.prices})
                console.log(prices)
                this.props.onNewData(prices[0].high_estimate)
            })
    }
    componentDidMount() {
        this.updateInfo();
        this.interval = setInterval(()=>{
            this.updateInfo()
        }, this.props.refreshEvery);
    }
    componentWillUnmount(){
        clearInterval(this.interval)
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.start !== this.props.start || nextProps.end !== this.props.end)
        if(nextProps.start !== this.props.start || nextProps.end !== this.props.end){
            console.log(nextProps.start)
            console.log(this.props.start)
            this.updateInfo()
            console.log("updating...");
        }
    }

    render(){
        // Combine etas and costs into a single object
        var etacost = this.state.eta.slice();
        this.state.eta.forEach((eta, index)=>{
            etacost[index].eta_seconds = eta.estimate;
            this.state.cost.forEach((cost)=>{
                if(cost.display_name === eta.display_name)
                    etacost[index].cost = (cost.high_estimate).toFixed(2);
            })
        })

        // Sort by price
        etacost.sort(function(a, b){ return a.cost - b.cost})

        // Format Data for bar chart
        var barData = [];
        etacost.forEach(function(ride){
            barData.push([ride.display_name, ride.cost])
        })
        return (
            <div>
                <h1>Uber</h1>
                <DisplayTable rideInfo={etacost}/>
            </div>
        )
    }
}

Uber.propTypes = {
    start: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
        address: PropTypes.string
    }).isRequired,
    end: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
        address: PropTypes.string
    }).isRequired,
}
export default Uber;