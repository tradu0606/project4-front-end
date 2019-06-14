import React from "react"
import { Component } from "react"
import axios from 'axios'
import ReactTooltip from "react-tooltip"
import TopNav from './TopNav/TopNav'
import './Map/globemap.css'
import { Route, Redirect } from 'react-router-dom'
import MapComponent from './Map/MapComponent'
import Bubble from './Bubble/BubbleChart'
import CountryDetails from './Map/CountryDetails'
import './Map/Map.css'
import './App.css'
import './Map/globemap.css'




let cache = {};

class App extends Component {
  constructor() {
    super()
    this.state = {
      pollutionsTotal: [],
      countries: [],
      bubbleOrGlobe: "Bubble Chart",
      yearButtonValue: "2016",
      totalOrCapitaValue: "CO2 PER CAPITA EMISSIONS",
      bubbleOrGlobePath: "/bubble",
      hoveredCountryDetails: {}


    }
  }

  componentDidMount() {
    axios.get('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json')
      .then(countries =>
        this.setState({
          countries: countries.data
        }))

    axios.get('https://co2-emissions-map.herokuapp.com/pollutions')
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
  bubbleOrGlobeComponent = () => {
    if (this.state.bubbleOrGlobe === "Bubble Chart") {
      this.setState({
        bubbleOrGlobe: "Globe Chart",
        bubbleOrGlobePath: '/'
      })
      return <Redirect to={this.state.bubbleOrGlobePath} />
    } else {
      this.setState({
        bubbleOrGlobe: "Bubble Chart",
        bubbleOrGlobePath: "/bubble"
      })
      return <Redirect to={this.state.bubbleOrGlobePath} />
    }
  }

  pollutionsData = () => {
    let pollutions
    if (this.state.totalOrCapitaValue === "CO2 PER CAPITA EMISSIONS") {
      pollutions = this.state.pollutionsTotal
    } else {
      pollutions = this.state.pollutionsPerCapita
    }
    return pollutions
  }
  getCountry = (geo) => {
    let pollutions = this.pollutionsData()

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
      axios.get('https://co2-emissions-map.herokuapp.com/pollutions_per_capita')
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
    let countryResult = this.getCountry(geo)
    if (countryResult.countryDetails !== undefined) {
      this.setState({
        hoveredCountryDetails: countryResult.countryDetails
      })
    }
  }



  getCountryPollution = (geo) => {
    let getCountry = this.getCountry(geo)
    return `${getCountry.countryName}: ${getCountry.countryPollutions}kton CO2`
  }
  getBackgroundColor = (geo) => {
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
    return (<div className="App">
      <div><h1>Global Carbon Monoxide Emissions</h1></div>
      <div>
        <Route
          path="/"
          render={(routerProps) =>
            <TopNav
              totalOrCapitaValue={this.state.totalOrCapitaValue}
              totalOrCapita={this.totalOrCapita}
              loadYearData={this.loadYearData}
              pollutionsData={this.pollutionsData}
              yearButtonValue={this.state.yearButtonValue}
              bubbleOrGlobe={this.state.bubbleOrGlobe}
              bubbleOrGlobeComponent={this.bubbleOrGlobeComponent}
              bubbleOrGlobePath={this.state.bubbleOrGlobePath}
              {...routerProps}
            ></TopNav>}>
        </Route>
        <div className='mapHolder'>
          <div className="elements" id="mapElement">

            <Route exact
              path="/"
              render={(routerProps) => <MapComponent
                totalOrCapitaValue={this.state.totalOrCapitaValue}
                totalOrCapita={this.totalOrCapita}
                loadYearData={this.loadYearData}
                pollutionsData={this.pollutionsData}
                yearButtonValue={this.state.yearButtonValue}
                bubbleOrGlobe={this.state.bubbleOrGlobe}
                getCountryDetails={this.getCountryDetails}
                getCountryPollution={this.getCountryPollution}
                getBackgroundColor={this.getBackgroundColor}
                getCountry={this.getCountry}
                {...routerProps} />}>
            </Route>
            <Route exact
              path="/bubble"
              render={(routerProps) => <Bubble yearButtonValue={this.state.yearButtonValue}
                pollutionData={this.pollutionsData}
                totalOrCapitaValue={this.state.totalOrCapitaValue}
                {...routerProps} />}>
            </Route>

          </div>
          <div className="elements" id="mapElement">
            <Route
              path="/"
              render={(routerProps) => <CountryDetails hoveredCountryDetails={this.state.hoveredCountryDetails} {...routerProps} />}>
            </Route></div>
        </div>
      </div>
    </div>)
  }
}

export default App