import React from "react"
import {
    ComposableMap,
    ZoomableGlobe,
    Geographies,
    Geography,
    Marker
} from "react-simple-maps"
import { Component } from "react"
import {Link} from 'react-dom'
import axios from 'axios'
import ReactTooltip from "react-tooltip"

const mapStyles = {
    width: "90%",
    height: "auto",
}

let cache = {};

class Map extends Component {
    constructor() {
        super()
        this.state = {
            pollutions: [],
            countries: []
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
                    pollutions: pollutions.data
                })
            })

        setTimeout(() => {
            ReactTooltip.rebuild()
        }, 100)

    }
    handleClick = (geo, evt) => {
        this.setState({
            countryCode: geo.id
        })

    }
    getCountry = (geo) => {

        let countryName = this.state.countries.filter(country => {
            return country["country-code"] === geo.id
        }).map(country => {
            return country.name
        })[0]
        if (countryName === undefined) {
            return geo.id
        } else {
            let countryPollution
            let countryPollutions = this.state.pollutions.filter(pollution => {
                countryPollution = pollution
                return pollution.Country.toLowerCase() === countryName.toLowerCase()
            }).map(pollutions => pollutions["2016"])
            return {
                countryName: countryName,
                countryPollutions: countryPollutions,
                countryDetails: countryPollution
            }
        }
    }
    getCountryDetails=(geo)=>{
        let getCountry = this.getCountry(geo)
        return <Link to={{ pathname: '/country_details', state: { country: getCountry.pollutions}}} />
        
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
                let maxPollution = this.state.pollutions.reduce((maxPollution, pollution) => {
                    if (maxPollution < parseInt(pollution["2016"])) {
                        return parseInt(pollution["2016"])
                    } else {
                        return maxPollution
                    }
                }, 0)

                let minPollution = this.state.pollutions.reduce((minPollution, pollution) => {
                    if (minPollution > parseInt(pollution["2016"])) {
                        return parseInt(pollution["2016"])
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
            return (
                <div>
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

                                        <Geography
                                            key={geo.id + i}
                                            data-tip={this.getCountryPollution(geo)}
                                            geography={geo}
                                            projection={proj}
                                            onClick={this.getCountryDetails(geo)}
                                            style={this.getBackgroundColor(geo)}

                                        />
                                    ))
                                }
                            </Geographies>
                        </ZoomableGlobe>
                    </ComposableMap>
                    <ReactTooltip />
                </div>
            )
        }
    }

    export default Map
