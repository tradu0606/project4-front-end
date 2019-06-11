import React, { Component } from 'react';

class Chart extends Component {
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

export default Chart;