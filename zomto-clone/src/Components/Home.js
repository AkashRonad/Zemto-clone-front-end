import React from 'react';
import axios from 'axios';
import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';




class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }
    }

    componentDidMount() {
        axios({
            method: 'GET',
            url: 'https://zomoto-clone-backend-code-api.herokuapp.com/location',
            headers: { 'Content-type': 'application/json' }
        }).then(response => {
            this.setState({ locations: response.data.Locations })
        }).catch(error => { console.log(error) })


        axios({
            method: 'GET',
            url: 'https://zomoto-clone-backend-code-api.herokuapp.com/mealType',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ mealtypes: response.data.mealtypes })
        }).catch(error => console.log(error))

    }

    render() {
        const { locations, mealtypes } = this.state;
        return (
            <div>
                <Wallpaper locations={locations} />
                <QuickSearch quicksearches={mealtypes} />

            </div>

        )
    }
}

export default Home;