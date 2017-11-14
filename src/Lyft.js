import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import DisplayTable from './DisplayTable';


class Lyft extends React.Component{
    constructor(props) {
        super(props)

        this.state = {eta: [],
                      cost: []}
        this.updateInfo = this.updateInfo.bind(this);
    }
    updateInfo() {

        // fetch('/lyft/cost')
        //     .then(res => res.json())
        //     .then(cost => this.setState({ cost: cost.cost_estimates}))
        axios.post('/lyft/eta', {start: this.props.start})
            .then(res => {
                this.setState({ eta: res.data.eta_estimates})})

        axios.post('/lyft/cost', {start: this.props.start, end: this.props.end})
            .then(res => {
                var costs = res.data.cost_estimates;
                costs.sort(function(a, b){ return a.estimated_cost_cents_max - b.estimated_cost_cents_max})
                this.props.onNewData((costs[0].estimated_cost_cents_max / 100).toFixed(2))
                this.setState({ cost: res.data.cost_estimates})})
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
        if(nextProps.start !== this.props.start || nextProps.end !== this.props.end){
            console.log(nextProps.start)
            console.log(this.props.start)
            this.updateInfo()
            console.log("updating...");
        }
        
        //this.updateInfo();
    }

    render(){
        // Combine etas and costs into a single object
        var etacost = this.state.eta.slice();
        this.state.eta.forEach((eta, index)=>{
            this.state.cost.forEach((cost)=>{
                if(cost.display_name === eta.display_name)
                    etacost[index].cost = (cost.estimated_cost_cents_max / 100).toFixed(2);
                    etacost[index].duration_seconds = cost.estimated_duration_seconds;
            })
        })
        // Sort by price
        etacost.sort(function(a, b){ return a.cost - b.cost})
        return (
            <div>
                <h1>Lyft</h1>
                <DisplayTable rideInfo={etacost}/>
            </div>
        )
    }
}

Lyft.propTypes = {
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
export default Lyft;