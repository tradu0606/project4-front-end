import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import Axios from 'axios';

class Map2 extends Component {
    constructor(){
        super()
        this.state ={
            data:[
                ["Country", "kton CO2"],
              ]
        }
    }
    componentDidMount(){
        Axios.get('http://localhost:3001/pollutions').then(pollution =>{
            let newArray  = pollution.data.map(country =>{
                let countryData = []
                countryData.push(country.Country)
                countryData.push(country[2016])
                return countryData})
            
            this.setState({
                data: this.state.data.push(newArray)
            
        })
            console.log(pollution.data)
        })
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


                                        // {this.state.countries.filter(country=> {
                                        //     return country["country-code"] == geo.id
                                        // }).map(country=>{
                                        //     return country.name})[0]}
