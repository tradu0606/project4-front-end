import React from "react"
import {
    ComposableMap,
    ZoomableGlobe,
    Geographies,
    Geography,
    Marker
} from "react-simple-maps"
import {Component} from "react"
import axios from 'axios'

const mapStyles = {
    width: "90%",
    height: "auto",
}

class Map extends Component {

    componentDidMount(){
        axios.get('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json')
            .then(countries =>
                this.setState({
                    countries: countries.data
                }))
    }
    handleClick = (proj, evt) =>{
        this.setState({ 
            countryCode: proj.id
        })

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
                    // geography="https://unpkg.com/world-atlas@1.1.4/world/110m.json"
                    geography="https://unpkg.com/world-atlas@1/world/110m.json"
                >
                    {(geos, proj) =>
                        geos.map((geo, i) => (
                        
                            <Geography
                                key={geo.id + i}
                                geography={geo}
                                projection={proj}
                                onClick={this.handleClick}
                                style={{
                                    default: { fill: "#CFD8DC" }
                                }}
                            
                            />
                            
                      
            ))
                    }
                </Geographies>
            </ZoomableGlobe>
        </ComposableMap>
    </div>
)
                }
            }

export default Map
