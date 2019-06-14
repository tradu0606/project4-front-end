import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import Axios from 'axios';



class CountryDetails extends Component {
    constructor() {
        super()
        this.state = {

            population2017: "7529.71",
            populationRate2016: "1.15",
            data: {
                labels: ["1990", "2000", "2005", "2010", "2012", "2014", "2015", "2016"],
                datasets: [
                    {
                        fill: false,
                        backgroundColor: "#fa936a",
                        borderColor: "#fa936a",
                        label: 'kton CO2',
                        data: [22452432, 25595733, 29771013, 33589795, 34792575, 35688794, 35633093, 35755322],
                        yAxisID: "y-axis-1"
                    },
                    {
                        fill: false,
                        backgroundColor: "#f72003",
                        borderColor: "#f72003",
                        label: 'population growth rate %',
                        data: [1.74, 1.32, 1.25, 1.22, 1.2, 1.2, 1.19, 1.18],
                        yAxisID: "y-axis-2"

                    }
                ]
            },
            country: {},
            countryNameProps: "World",
            options: {
                scales: {
                    yAxes: [{
                        type: "linear",
                        display: true,
                        position: "left",
                        id: "y-axis-1",
                        ticks: {
                            fontColor: "#fa936a",
                            min: 0,

                        }
                    }, {
                        type: "linear", 
                        display: true,
                        position: "right",
                        id: "y-axis-2",
                        ticks: {
                            fontColor: "#f72003",

                        },

                        gridLines: {
                            drawOnChartArea: false, 
                        }
                    }],
                    xAxes:
                        [{
                            display: true,
                            ticks: {
                                fontColor: "rgb(187, 187, 197)",
                            }
                        }]
                },
                title: {
                    display: false,

                },
                legend: {
                    display: true,
                    labels: {
                        fontColor: "rgb(187, 187, 197)",

                    }
                }
            },

        }
    }

    loadProps = () => {
        let labels = ["1990", "2000", "2005", "2010", "2012", "2014", "2015", "2016"]
        let country = this.props.hoveredCountryDetails
        let countryName = country.Country
        console.log(countryName)
        if (countryName !== undefined) {
            let dataCO2 = labels.map(year => {
                return country[year]
            })
            let populationRate2016 = this.state.populationDataRate.filter(countryData => {
                return countryData.CountryName === countryName
            })[0]
            let dataPopulation
            if (populationRate2016 !== undefined) {
                dataPopulation = labels.map(year => {
                    return populationRate2016[year]
                })
                populationRate2016 = Math.round(populationRate2016["2016"] * 100) / 100
            }
            let population2017 = this.state.populationDataYearly.filter(countryData => {
                return countryData.CountryName === countryName
            })[0]
            if (population2017 !== undefined) {
                population2017 = Math.round(population2017["2017"] * 100) / 100
            }
            this.setState({
                population2017: population2017,
                populationRate2016: populationRate2016,
                countryNameProps: countryName,
                data: {
                    labels: labels,
                    datasets: [
                        {
                            fill: false,
                            backgroundColor: "#fa936a",
                            borderColor: "#fa936a",
                            label: 'kton CO2',
                            data: dataCO2,
                            yAxisID: "y-axis-1"

                        },
                        {
                            fill: false,
                            backgroundColor: "#f72003",
                            borderColor: "#f72003",
                            label: 'population growth rate %',
                            data: dataPopulation,
                            yAxisID: "y-axis-2"

                        }
                    ],
                },

            })
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.hoveredCountryDetails === undefined) {
            nextProps = this.props
        } else if (nextProps.hoveredCountryDetails.Country !== this.props.hoveredCountryDetails.Country) {

            setTimeout(this.loadProps, 100)
        }
    }

    componentDidMount = () => {

        Axios.get("https://co2-emissions-map.herokuapp.com/population/from1990").then(populationData => {
            this.setState({
                populationDataRate: populationData.data
            })
        })
        Axios.get("https://co2-emissions-map.herokuapp.com/population_yearly/2017").then(populationYearly => {
            this.setState({
                populationDataYearly: populationYearly.data
            })
        })

    }


    render() {
        // console.log(this.state.populationData)
        return (
            <div className="countryDetails">
                <h2>Country: {this.state.countryNameProps}</h2>
                <h3>Population 2017: {this.state.population2017} million people</h3>
                <h3>Population growth rate 2016:  {this.state.populationRate2016}%</h3>
                <Line
                    data={this.state.data} options={this.state.options}
                >

                </Line>
            </div>
        );
    }
}

export default CountryDetails;


