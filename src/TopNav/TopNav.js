import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
class TopNav extends Component {
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

    loadYearData = (evt) => {
        evt.preventDefault()
        this.setState({
            yearButtonValue: evt.target.value
        })
    }
    render() {
        return (
            <div>
                    
                    <input type="button" onClick={this.props.totalOrCapita} value={this.props.totalOrCapitaValue}></input>
                    <input type="button" onClick={this.props.loadYearData} value="1990"></input>
                    <input type="button" onClick={this.props.loadYearData} value="2000"></input>
                    <input type="button" onClick={this.props.loadYearData} value="2005"></input>
                    <input type="button" onClick={this.props.loadYearData} value="2010"></input>
                    <input type="button" onClick={this.props.loadYearData} value="2012"></input>
                    <input type="button" onClick={this.props.loadYearData} value="2014"></input>
                    <input type="button" onClick={this.props.loadYearData} value="2015"></input>
                    <input type="button" onClick={this.props.loadYearData} value="2016"></input>
                    <Link to={{
                        pathname: '/bubble',
                        state: {
                            pollutionData: this.props.pollutionsData(),
                            yearButtonValue: this.props.yearButtonValue
                        }
                    }}>
                        <input type="button" value={this.props.bubbleOrGlobe}></input>
                    </Link>
            </div>
        );
    }
}

export default TopNav;