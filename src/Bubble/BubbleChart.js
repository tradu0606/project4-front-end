import React, { Component } from 'react';
import BubbleChart from '@weknow/react-bubble-chart-d3';

class Bubble extends Component {
    constructor(){
        super()
        this.state = {

        }
    }

    componentDidMount(){
        let yearButtonValue = this.props.location.state.yearButtonValue
        let data = this.props.location.state.pollutionData.map(countyData=>{
            return {
                label: countyData.Country,
                value:  Math.round(countyData[yearButtonValue]) 
            }
        })
        this.setState({
            data: data,
            yearButtonValue: yearButtonValue
        })
        console.log(data)

}

    render() {
        return (
            <div>
                <BubbleChart
                    graph={{
                        zoom: 1.1,
                        offsetX: -0.05,
                        offsetY: -0.01,
                    }}
                    width={1000}
                    height={800}
                    padding={0}
                    showLegend={true} // optional value, pass false to disable the legend.
                    legendPercentage={20} // number that represent the % of with that legend going to use.
                    legendFont={{
                        family: 'Arial',
                        size: 12,
                        color: 'white',
                        weight: 'bold',
                    }}
                    valueFont={{
                        family: 'Arial',
                        size: 12,
                        color: '#fff',
                        weight: 'bold',
                    }}
                    labelFont={{
                        family: 'Arial',
                        size: 16,
                        color: '#fff',
                        weight: 'bold',
                    }}
                    //Custom bubble/legend click functions such as searching using the label, redirecting to other page
                    bubbleClickFunc={this.bubbleClick}
                    legendClickFun={this.legendClick}
                    data={this.state.data}
                />

            </div>
        );
    }
}

export default Bubble;