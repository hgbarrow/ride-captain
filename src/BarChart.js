import React from 'react';
import c3 from 'c3';
require('./c3style.css')

class BarChart extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            
        }
        this.chart = null;
    }
    componentDidMount() {
        this.chart = this.generateChart();
    }
    componentDidUpdate() {
        if(this.chart) {
            this.chart.load({
                columns: this.props.data
            })
        }
    }
    generateChart(){
        var chart = c3.generate({
            bindto: "#uber-series",
            data: {
                columns: this.props.data,
                type: 'bar'
              },
            axis: {
                x: {
                    tpye: 'category'
                }
            },
            color: {
                pattern: ['#222233', '#E70B81']
            }
        });
        return(chart)
    }
    render() {
        return (
            <div id="uber-series"></div>
        );
    }
}


export default BarChart;