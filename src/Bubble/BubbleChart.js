import React, { Component } from 'react';
import BubbleChart from '@weknow/react-bubble-chart-d3';
import './BubbleChart.css'

class Bubble extends Component {
    constructor(){
        super()
        this.state = {

        }
    }

    componentWillReceiveProps(nextProps) {
  
        if (nextProps.totalOrCapitaValue !== this.props.totalOrCapitaValue || 
            nextProps.yearButtonValue !== this.props.yearButtonValue) {
            let yearButtonValue = nextProps.yearButtonValue
            let pollutionData = nextProps.pollutionData()
            let data = pollutionData.map(countyData=>{
                return {
                    label: countyData.Country,
                    value:  Math.round(countyData[yearButtonValue]) 
                }
            })
            this.setState({
                data: data,
                yearButtonValue: yearButtonValue,
                totalOrCapitaValue: nextProps.totalOrCapitaValue
            })
        }
      }

    componentDidMount(){
        
        
        let yearButtonValue = this.props.yearButtonValue
        let pollutionData = this.props.pollutionData()
        let data = pollutionData.map(countyData=>{
            return {
                label: countyData.Country,
                value:  Math.round(countyData[yearButtonValue]) 
            }
        })
        this.setState({
            data: data,
            yearButtonValue: yearButtonValue,
            totalOrCapitaValue: this.props.totalOrCapitaValue
        })
        

}

    render() {
       console.log(this.state.data)
        return (
            <div >
                <BubbleChart
                    graph={{
                        zoom: .9,
                        // offsetX: -0.05,
                        // offsetY: -0.01,
                    }}
                    width={600}
                    height={700}
                    padding={0}
                    overflow={true}
                    showLegend={false} 
                    legendPercentage={20} 
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
                    
                    bubbleClickFunc={this.bubbleClick}
                    legendClickFun={this.legendClick}
                    data={this.state.data}
                />

            </div>
        );
    }
}

export default Bubble;