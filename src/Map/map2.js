import React, { Component } from 'react';
import { Chart } from "react-google-charts";

class Map2 extends Component {
    constructor(){
        super()
        this.state ={
            data:[
                ["Country", "Popularity"],
                ["Germany", 200],
                ["United States", 300],
                ["Brazil", 400],
                ["Canada", 500],
                ["France", 600],
                ["RU", 700]
              ]
        }
    }
    render() {
        return (
            <Chart
            chartType="GeoChart"
            width="100%"
            height="400px"
            legendToggle
            data={this.state.data}
            chartEvents={[
                {
                  eventName: "select",
                  callback: ({ chartWrapper }) => {
                    const chart = chartWrapper.getChart();
                    const selection = chart.getSelection();
                    if (selection.length === 0) return;
                    const region = this.state.data[selection[0].row + 1];
                    console.log("Selected : " + region);
                  }
                }
              ]}
          />
        )
    }
}

export default Map2;

