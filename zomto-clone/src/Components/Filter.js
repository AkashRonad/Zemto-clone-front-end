import React from 'react';
import '../Styles/Filter.css';
import queryString from 'query-string';
import axios from 'axios';
import Checkbox from 'rc-checkbox';
import noitem from '../Assets/no-items.png';


class Filter extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            mealTypes: [],
            locations: [],
            pageCount:[],
            cusineId: undefined,
            locationId: undefined,
            mealTypeId: undefined,
            hCost: undefined,
            lCost: undefined,
            sort: 1,
            page: 1,

        }
    }

    componentWillUnmount() {
        sessionStorage.clear();
    }

    componentDidMount() {
        const queryParams = queryString.parse(this.props.location.search);
        const mealType = queryParams.mealtype;
        const location = queryParams.location;
        const cuisine_id = queryParams.cuisine;
        const location_id = queryParams.area;
        const hcost = queryParams.costlessthan;
        const lcost = queryParams.costmorethan;
        const sort = queryParams.sort;
        const page = queryParams.page;



        // Filter API Call 

        const filterObj = {
            locationId: location,
            mealTypeId: mealType
        }

        axios({
            method: 'POST',
            url: 'https://zomoto-clone-backend-code-api.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, locationId: location, mealTypeId: mealType, pageCount: response.data.pageCount})
        }).catch(error => console.log(error))



        axios({
            method: 'GET',
            url: 'https://zomoto-clone-backend-code-api.herokuapp.com/location',
            headers: { 'Content-type': 'application/json' }
        }).then(response => {
            this.setState({ locations: response.data.Locations })
        }).catch(error => { console.log(error) })



        axios({
            method: 'GET',
            url: `https://zomoto-clone-backend-code-api.herokuapp.com/mealType/${mealType}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ mealTypes: response.data.mealtypes })
        }).catch(error => console.log(error))


    }

    handleClick = (Id) => {
        this.props.history.push(`/details/?restaurant=${Id}`);
    }


    handleSortChange = (sort) => {
        const { mealTypeId, locationId, cusineId, hCost, lCost, page } = this.state;


        const filterObj = {
            mealTypeId: mealTypeId,
            cusineId: cusineId,
            locationId: locationId,
            hCost: hCost,
            lCost: lCost,
            sort: sort,
            page: page
        }






        axios({
            method: 'POST',
            url: 'https://zomoto-clone-backend-code-api.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, sort: sort })
        }).catch(error => console.log(error))

        this.props.history.push(`/filter/?mealtype=${mealTypeId}&cuisine=${cusineId}&area=${locationId}&costlessthan=${hCost}&costmorethan=${lCost}&sort=${sort}&page=${page}`)

    }


    handleCostChange = (lCost, hCost) => {
        const { mealTypeId, locationId, cusineId, page, sort } = this.state;


        const filterObj = {
            mealTypeId: mealTypeId,
            cusineId: cusineId,
            locationId: locationId,
            hCost: hCost,
            lCost: lCost,
            sort: sort,
            page: page
        }


        axios({
            method: 'POST',
            url: 'https://zomoto-clone-backend-code-api.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, lCost: lCost, hCost: hCost })
            console.log(response)
        }).catch(error => console.log(error))

        this.props.history.push(`/filter/?mealtype=${mealTypeId}&cuisine=${cusineId}&area=${locationId}&costlessthan=${hCost}&costmorethan=${lCost}&sort=${sort}&page=${page}`)
    }


    handleChange = (e) => {
       
        const checkedValue = e.target.value;
        


    }
    locationhandler = (event) => {

        const { mealTypeId, cusineId, hCost, lCost, page, sort } = this.state;
        const locationId = event.target.value;
        const filterObj = {
            mealTypeId: mealTypeId,
            cusineId: cusineId,
            locationId: locationId,
            hCost: hCost,
            lCost: lCost,
            sort: sort,
            page: page
        }

        axios({
            method: 'POST',
            url: 'https://zomoto-clone-backend-code-api.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, locationId: locationId })
        }).catch(error => console.log(error))

        this.props.history.push(`/filter/?mealtype=${mealTypeId}&cuisine=${cusineId}&area=${locationId}&costlessthan=${hCost}&costmorethan=${lCost}&sort=${sort}&page=${page}`)

    }




    handlePageChange = (page) => {
        const { mealTypeId, locationId, cusineId, hCost, lCost, sort } = this.state;

        const filterObj = {
            mealTypeId: mealTypeId,
            cusineId: cusineId,
            locationId: locationId,
            hCost: hCost,
            lCost: lCost,
            sort: sort,
            page: page
        }

        axios({
            method: 'POST',
            url: 'https://zomoto-clone-backend-code-api.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, page: page })
        }).catch(error => console.log(error))

        this.props.history.push(`/filter/?mealtype=${mealTypeId}&cuisine=${cusineId}&area=${locationId}&costlessthan=${hCost}&costmorethan=${lCost}&sort=${sort}&page=${page}`)

    }



    render() {
        const { restaurants, mealTypes } = this.state;
        return (
            <React.Fragment>

                <div>
                    {mealTypes.map(item  => {
                        return <div id="myId" className="heading-filterComp">{item.name} Places in Delhi</div>
                    })}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-4 col-md-4 col-lg-4 filter-options">
                                <span className="glyphicon glyphicon-th-list toggle-span" data-toggle="collapse"
                                    data-target="#demo"></span>
                                <div id="demo" className="collapse show">
                                    <div className="filter-heading">Filters</div>
                                    <div className="Select-Location">Select Location</div>
                                    <select className="Rectangle-2236" onChange={e => this.locationhandler(e)}>
                                        <option value="0">Select</option>
                                        {this.state.locations.map(item => {
                                            return <option value={item.location_id} >{item.name}</option>
                                        })}
                                    </select>
                                    <div className="Cuisine">Cuisine</div>
                                    <div>
                                        <Checkbox name="North_Indian" value="1" onChange={e => this.handleChange(e)} />
                                        <span className="checkbox-items">North Indian</span>
                                    </div>
                                    <div>
                                        <Checkbox name="South_Indian" value="2" onChange={e => this.handleChange(e)} />
                                        <span className="checkbox-items">South Indian</span>
                                    </div>
                                    <div>
                                        <Checkbox name="Chineese" value="3" onChange={e => this.handleChange(e)} />
                                        <span className="checkbox-items">Chineese</span>
                                    </div>
                                    <div>
                                        <Checkbox name="Fast_Food" value="4" onChange={e => this.handleChange(e)} />
                                        <span className="checkbox-items">Fast Food</span>
                                    </div>
                                    <div>
                                        <Checkbox name="Street_Food" value="5" onChange={e => this.handleChange(e)} />
                                        <span className="checkbox-items">Street Food</span>
                                    </div>
                                    <div className="Cuisine">Cost For Two</div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 500)} />
                                        < span className="checkbox-items">Less than &#8377; 500</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(500, 1000)} />
                                        <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1000, 1500)} />
                                        <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1500, 2000)} />
                                        <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(2000, 10000)} />
                                        <span className="checkbox-items">&#8377; 2000 +</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 10000)} />
                                        <span className="checkbox-items">All</span>
                                    </div>
                                    <div className="Cuisine">Sort</div>
                                    <div>
                                        <input type="radio" name="sort" onChange={() => this.handleSortChange(1)} />
                                        <span className="checkbox-items">Price low to high</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="sort" onChange={() => this.handleSortChange(-1)} />
                                        <span className="checkbox-items">Price high to low</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-8 col-md-8 col-lg-8">
                                {restaurants.length > 0 ? restaurants.map((item) => {
                                    return <div className="Item" onClick={() => this.handleClick(item._id)}>
                                        <div className="row pl-1">
                                            <div className="col-sm-4 col-md-4 col-lg-4">
                                                <img className="img" src={`../${item.image}`} />
                                            </div>
                                            <div className="col-sm-8 col-md-8 col-lg-8">
                                                <div className="rest-name">{item.name}</div>
                                                <div className="res-location">{item.locality}</div>
                                                <div className="rest-address">{item.address}</div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row padding-left">
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                <span className="rest-address">CUISINES :</span>

                                                {item.cuisine.map(item => {
                                                    return <span className="rest-address">{`${item.name},`}</span>
                                                })}

                                                <div className="rest-address">COST FOR TWO : &#8377; {item.min_price} </div>
                                            </div>
                                        </div>
                                    </div>
                                }):<div className="No-items">
                                    <img src={noitem} alt="page loading"  className="no-img"/>
                                    <p className="no-item-font-color">Sorry No Items</p>
                                    </div>}
                                <div className="pagination">
                                    <a onClick={() => this.handlePageChange(1)}>&laquo;</a>
                                    {restaurants.length > 0 ? this.state.pageCount.map((currElement,index)=>{
                                        return  <a onClick={() => this.handlePageChange(currElement)}>{currElement}</a>
                                    }):null}
                                    <a onClick={() => this.handlePageChange(this.state.pageCount.length)}>&raquo;</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </React.Fragment>

        )
    }
}

export default Filter;