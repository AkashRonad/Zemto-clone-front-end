import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../Styles/Wallpaper.css';
import homeImag from '../Assets/homepageimg.png';


class Wallpaper extends React.Component {


    constructor() {
        super();
        this.state = {
            restaurants: [],
            text: '',
            suggestions: []
        }
    }


    collectLocation=(event)=>{
        const L_Id = event.target.value;
        sessionStorage.setItem('locationId',L_Id);

        axios({
            method: 'GET',
            url: `https://zomoto-clone-backend-code-api.herokuapp.com/restaurantbyId/${Id}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(res => this.setState({ restaurants: res.data.restaurant }))
            .catch(err => console.log(err))

            console.log(this.state.restaurants.map(item=>item));

    }


    handleInputChange = (e) => {
        const value = e.target.value;
        const { restaurants } = this.state;
        let suggestions = [];

        if (value.length > 0) {
            suggestions = restaurants.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
            console.log(suggestions.map(item=>item));
        }
        this.setState(() => ({
            suggestions: suggestions,
            text: value
        }))
    }

    selectedText = (itemObj) => {
        this.setState({
            text: itemObj.name,
            suggestions: [],
        }, () => {
            this.props.history.push(`/details/?restaurant=${itemObj._id}`);
        })
    }

    renderSuggestions = () => {
        const { suggestions } = this.state;

        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul className="search-bar-item-show1" >
                {
                    suggestions.map((item, index) => (<li className="search-bar-item-show" key={index} onClick={() => this.selectedText(item)}>{`${item.name}`}</li>))
                }
            </ul>
        );
    }



    render() {
        const { locations } = this.props;
        const {text}=this.state;
        return (
            <React.Fragment>
                <img src={homeImag} style={{ width: '100%', height: '450px' }} />
                <div>
                    <div className="logo2">
                        <p>e!</p>
                    </div>
                    <div className="headings">
                        Find the best restaurants, cafes, bars
                     </div>
                    <div className="locationSelector">
                        <select className="locationDropdown" onChange={(e)=>this.collectLocation(e)}>
                            <option value="0">Select</option>
                            {locations.map(item => {
                                return <option value={item.location_id}>{item.name}</option>
                            })}

                        </select>
                        <div id="notebooks">
                        <input id="query" className="restaurantsinput" type="text" placeholder="Please Enter Restaurant Name" value={text} onChange={this.handleInputChange} />
                            {this.renderSuggestions()}
                            </div>
                            <span className="glyphicon glyphicon-search search"></span>
                       
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default withRouter(Wallpaper);