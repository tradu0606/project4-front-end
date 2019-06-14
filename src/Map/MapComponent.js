import React from "react"
import {
    ComposableMap,
    ZoomableGlobe,
    Geographies,
    Geography,
    Marker
} from "react-simple-maps"
import { Component } from "react"
import ReactTooltip from "react-tooltip"
import './globemap.css'
const mapStyles = {
    width: "90%",
    height: "auto",
    pressed:{
        outline: "none",
    }
}

class MapComponent extends Component {
    componentDidMount(){
        this.setState({
            totalOrCapitaValue: this.props.totalOrCapitaValue
        })

        console.log(this.props.totalOrCapitaValue)
    }
    render() {
        console.log("renderMap")
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
                                    
                                        <Geography
                                            key={geo.id + i}
                                            data-tip={this.props.getCountryPollution(geo)}
                                            style={{
                                                pressed:{
                                                    outline: "none",
                                                }
                                            }}
                                            // onMouseEnter={this.props.getCountryDetails(geo)}
                                            geography={geo}
                                            projection={proj}
                                            onMouseEnter={()=>this.props.getCountryDetails(geo)}
                                            style={this.props.getBackgroundColor(geo)}

                                        />
                                    
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