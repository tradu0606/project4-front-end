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
import TopNav from '../TopNav/TopNav'
import './globemap.css'
import CountryDetails from '../Map/CountryDetails'
import { Route, Switch } from 'react-router-dom'
import Bubble from '../Bubble/BubbleChart'
const mapStyles = {
    width: "90%",
    height: "auto",
}

class MapComponent extends Component {
    componentDidMount(){
        this.setState({
            totalOrCapitaValue: this.props.totalOrCapitaValue
        })

        console.log(this.props.totalOrCapitaValue)
    }
    render() {
        return (
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
                                    <Link to={{ pathname: '/map/country_details', state: { country: this.props.getCountryDetails(geo) } }}>
                                        <Geography
                                            key={geo.id + i}
                                            data-tip={this.props.getCountryPollution(geo)}
                                            geography={geo}
                                            projection={proj}
                                            // onClick={this.getCountryDetails(geo)}
                                            style={this.props.getBackgroundColor(geo)}

                                        />
                                    </Link>
                                ))
                            }
                        </Geographies>
                    </ZoomableGlobe>
                </ComposableMap>
            <ReactTooltip />
            </div >
        );
    }
}

export default MapComponent;