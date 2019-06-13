import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class TopNav extends Component {
    setRedirect=()=>{
        this.props.bubbleOrGlobeComponent()
    }

    render() {
        console.log(this.props.bubbleOrGlobePath)
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
                   <Link to={this.props.bubbleOrGlobePath} onClick={this.props.bubbleOrGlobeComponent}>
                        <input type="button" value={this.props.bubbleOrGlobe} ></input>
                        </Link>
                
            </div>
        );
    }
}

export default TopNav;