import React from "react"
import {
    ComposableMap,
    ZoomableGlobe,
    Geographies,
    Geography,
    Marker
} from "react-simple-maps"
import { Component } from "react"
import { Link } from 'react-router-dom'
import axios from 'axios'
import ReactTooltip from "react-tooltip"
import './globemap.css'

const mapStyles = {
    width: "90%",
    height: "auto",
}

let cache = {};

class Map extends Component {
    constructor() {
        super()
        this.state = {
            pollutionsTotal: [],
            countries: [],
            bubbleOrGlobe: "Bubble Chart",
            yearButtonValue: "2016",
            totalOrCapitaValue: "CO2 PER CAPITA EMISSIONS",


        }
    }

    componentDidMount() {
        axios.get('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json')
            .then(countries =>
                this.setState({
                    countries: countries.data
                }))

        axios.get('http://localhost:3001/pollutions')
            .then(pollutions => {
                this.setState({
                    pollutionsTotal: pollutions.data
                })
            })


        setTimeout(() => {
            ReactTooltip.rebuild()
        }, 100)
    }
    loadYearData = (evt) => {
        evt.preventDefault()
        this.setState({
            yearButtonValue: evt.target.value
        })
    }
    getCountry = (geo) => {
        let pollutions
        if (this.state.totalOrCapitaValue === "CO2 PER CAPITA EMISSIONS") {
            pollutions = this.state.pollutionsTotal
        } else {
            pollutions = this.state.pollutionsPerCapita
        }
        let countryName = this.state.countries.filter(country => {
            return country["country-code"] === geo.id
        }).map(country => {
            return country.name
        })[0]
        if (countryName === undefined) {
            return geo.id
        } else {
            let countryPollution
            let countryPollutions = pollutions.filter(pollution => {

                return pollution.Country.toLowerCase() === countryName.toLowerCase()
            }).map(pollutions => {
                countryPollution = pollutions
                return pollutions[this.state.yearButtonValue]
            }
            )
            return {
                countryName: countryName,
                countryPollutions: countryPollutions,
                countryDetails: countryPollution
            }
        }
    }
    checkValue = () => {
        if (this.state.totalOrCapitaValue === "CO2 PER CAPITA EMISSIONS") {
            this.setState({
                totalOrCapitaValue: "CO2 TOTAL EMISSIONS"
            })
        } else {
            this.setState({
                totalOrCapitaValue: "CO2 PER CAPITA EMISSIONS"
            })
        }
    }
    totalOrCapita = (evt) => {
        evt.preventDefault()
        if (this.state.pollutionsPerCapita === undefined) {
            axios.get('http://localhost:3001/pollutions_per_capita')
                .then(pollutions => {
                    this.setState({
                        pollutionsPerCapita: pollutions.data
                    })
                }).then(data => {
                    this.checkValue()
                })
        } else {
            this.checkValue()
        }
    }
    getCountryDetails = (geo) => {
        let getCountry = this.getCountry(geo)
        return getCountry.countryDetails

    }
    getCountryPollution = (geo) => {
        let getCountry = this.getCountry(geo)
        return `${getCountry.countryName}: ${getCountry.countryPollutions}kton CO2`
    }
    getBackgroundColor(geo) {
        let getCountry = this.getCountry(geo)
        if (getCountry.countryName === undefined) {
            return {
                default: { fill: "#CFD8DC" },
                hover: { fill: "red" },
                pressed: {
                    stroke: "blue",
                    fill: "red"
                }
            }
        } else {
            let pollutions
            if (this.state.totalOrCapitaValue === "CO2 PER CAPITA EMISSIONS") {
                pollutions = this.state.pollutionsTotal
            } else {
                pollutions = this.state.pollutionsPerCapita
            }
            let maxPollution = pollutions.reduce((maxPollution, pollution) => {
                if (maxPollution < parseInt(pollution[this.state.yearButtonValue])) {
                    return parseInt(pollution[this.state.yearButtonValue])
                } else {
                    return maxPollution
                }
            }, 0)

            let minPollution = pollutions.reduce((minPollution, pollution) => {
                if (minPollution > parseInt(pollution[this.state.yearButtonValue])) {
                    return parseInt(pollution[this.state.yearButtonValue])
                } else {
                    return minPollution
                }
            }, 104327520)

            let startColor = [186, 241, 255]
            let endColor = [208, 0, 9]
            let color = []
            let pollutionCoefficient = (getCountry.countryPollutions - minPollution) / (maxPollution - minPollution)

            for (let i = 0; i < 3; i++) {
                color.push(Math.round((endColor[i] - startColor[i]) * pollutionCoefficient + startColor[i]))
            }

            let prop = `color${geo.id}`
            cache[prop] = {
                default: { fill: `rgb(${color[0]}, ${color[1]}, ${color[2]})` },
                hover: { fill: "red" },
                pressed: {
                    stroke: "blue",
                    fill: "red"
                }
            }
            return {
                default: { fill: `rgb(${color[0]}, ${color[1]}, ${color[2]})` },
                hover: { fill: "red" },
                pressed: {
                    stroke: "blue",
                    fill: "red"
                }
            }
        }
    }
    render() {
        console.log("render")
        return (
            <div>
                <div>
                    <input type="button" onClick={this.totalOrCapita} value={this.state.totalOrCapitaValue}></input>
                    <input type="button" onClick={this.loadYearData} value="1990"></input>
                    <input type="button" onClick={this.loadYearData} value="2000"></input>
                    <input type="button" onClick={this.loadYearData} value="2005"></input>
                    <input type="button" onClick={this.loadYearData} value="2010"></input>
                    <input type="button" onClick={this.loadYearData} value="2012"></input>
                    <input type="button" onClick={this.loadYearData} value="2014"></input>
                    <input type="button" onClick={this.loadYearData} value="2015"></input>
                    <input type="button" onClick={this.loadYearData} value="2016"></input>
                    <input type="button" value={this.state.bubbleOrGlobe}></input>
                </div>
                <div id="globemap">
                <ComposableMap
                    width={500}
                    height={500}
                    projection="orthographic"
                    projectionConfig={{ scale: 220 }}
                    style={mapStyles}
                >
                    <ZoomableGlobe>
                        <circle cx={250} cy={250} r={220} fill="transparent" stroke="#CFD8DC" />
                        <Geographies
                            disableOptimization
                            geography="https://unpkg.com/world-atlas@1/world/110m.json"
                        >
                            {(geos, proj) =>
                                geos.map((geo, i) => (
                                    <Link to={{ pathname: '/country_details', state: { country: this.getCountryDetails(geo) } }}>
                                        <Geography
                                            key={geo.id + i}
                                            data-tip={this.getCountryPollution(geo)}
                                            geography={geo}
                                            projection={proj}
                                            // onClick={this.getCountryDetails(geo)}
                                            style={this.getBackgroundColor(geo)}

                                        />
                                    </Link>
                                ))
                            }
                        </Geographies>
                    </ZoomableGlobe>
                </ComposableMap>
                </div>
                <ReactTooltip />
            </div >
        )
    }
}

export default Map
