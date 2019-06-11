import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';


class CountryDetails extends Component {
        constructor() {
            super()
            this.state = {
                data:{}
            }
        }


    componentDidMount(){
        var labels = ["1990", "2000", "2005", "2010", "2012", "2014", "2015", "2016"]
        var data = labels.map(year =>{
            return this.props.location.state.country[year]
        })
        var countryName = this.props.location.state.country.Country
        console.log(countryName)
        this.setState({
            data: {
                labels: labels,
                datasets: [
                    {
                        fill: false,
                        backgroundColor: "rgb(5, 0, 86)",
                        borderColor: "white",
                        label: 'kton CO2',
                        data: data
                    }
                ],
                options: {
                    title: {
                        display: true,
                        text: countryName
                    }
                }
            },
        })
    }

    
    render() {
        console.log(this.props.location.state)
        return (
            
                <Line 
                data={this.state.data}
                >
                
                </Line>
            
        );
    }
}

export default CountryDetails;