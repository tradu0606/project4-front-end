import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';



class CountryDetails extends Component {
    constructor() {
        super()
        this.state = {
            data: {},
            country: {}
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.hoveredCountryDetails === undefined) {
            nextProps = this.props
        } else if (nextProps.hoveredCountryDetails.Country !== this.props.hoveredCountryDetails.Country) {
            this.componentDidMount()
        }
    }

    componentDidMount = () => {
        var labels = ["1990", "2000", "2005", "2010", "2012", "2014", "2015", "2016"]
        var country = this.props.hoveredCountryDetails
        console.log(this.props.hoveredCountryDetails)
        var data = labels.map(year => {
            return country[year]
        })
        var countryName = country.Country
        console.log(countryName)
        this.setState({
            countryName: countryName,
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
        // console.log(this.state.data)
        return (
            <div className="countryDetails">
                <h3>Country: {this.state.countryName}</h3>
                <h3>Polulation: </h3>
                <h3>Population growth rate:</h3>
                <Line
                    data={this.state.data}
                >

                </Line>
            </div>
        );
    }
}

export default CountryDetails;