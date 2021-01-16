import React, { useState } from 'react';
import queryString from 'query-string';
import axios from 'axios';
import '../Styles/Details.css';
import Rating from 'react-rating'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';



class Details extends React.Component {




    constructor() {
        super();
        this.cartitemarray = [];
        this.state = {
            restaurants: [],
            addcartitem: [],
            userselectitem:[],
            restaurant_id: undefined,
            itemModalIsOpen: false,
            handlecartopen: false,
            formModalIsOpen: false,
            galleryModalIsOpen: false,
            locationModalIsOpen: false,
            subTotal: 0,
            name: '',
            contactNumber: '',
            address: '',
            email: ''




        }
    }

    static defaultProps = {
        center: {
            lat: 59.95,
            lng: 30.33
        },
        zoom: 11
    };



    componentDidMount() {
        const queryParams = queryString.parse(this.props.location.search);
        const restaurant_id = queryParams.restaurant;
        console.log(restaurant_id);





        // Filter API Call 

        axios({
            method: 'GET',
            url: `http://localhost:8900/restaurant/${restaurant_id}`,
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, restaurant_id: restaurant_id })
            console.log(response);
        }).catch(error => console.log(error))
    }


    handleOrder = () => {
        const { restaurant_id } = this.state;
        console.log("hello");
        axios({
            method: 'GET',
            url: `http://localhost:8900/restaurant/${restaurant_id}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ items: response.data.restaurant, itemModalIsOpen: true })
        }).catch(error => console.log(error));
    }

    handleModalClose = (state) => {
        this.setState({ [state]: false });
    }



    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.restaurants.itemList];
        console.log(items);
        const item = items[index];



        if (operationType == 'add') {

            item.qty = item.qty + 1;
        }
        else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.rate;
        })
        const filter = items.filter(item => item.qty > 0);
        this.setState({ items: items, subTotal: total,userselectitem:filter});
       
        

    }

    handlePay = () => {
        this.setState({ itemModalIsOpen: false, formModalIsOpen: true })
    }

    handlecart = (index) => {
        const items = [...this.state.restaurants.itemList];
        const item = items[index];
        this.cartitemarray.push(item);
        this.setState({ handlecartopen: true, itemModalIsOpen: false, addcartitem: this.cartitemarray })

    }

    handleremovecart = (index) => {
        const { addcartitem } = this.state;
        const items2 = [...addcartitem];
        items2.splice(index, 1);
        this.setState({ addcartitem: items2 })
        console.log(addcartitem);

    }

    handlebuynow = () => {
        this.setState({ itemModalIsOpen: true, handlecartopen: false })
    }

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    handleSubmit = (event) => {
        const { name, contactNumber, address, email } = this.state;
        if (name && contactNumber && address && email) {
            const obj = {
                name: name,
                contactNumber: contactNumber,
                address: address,
                email: email
            };
            // Payment API Call
        }
        else {
            alert('All are mandatory feilds, plz fill them');
        }
        event.preventDefault();
    }

    handleGallery = () => {
        this.setState({ galleryModalIsOpen: true });
    }

    handleLocation = () => {
        this.setState({ locationModalIsOpen: true });
    }



    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {

        return fetch(`http://localhost:8900/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    makePayment = (e) => {

        const { subTotal, name, contactNumber, address, email,userselectitem } = this.state;
        console.log(userselectitem.map(item=>item),subTotal,name,contactNumber,address,email);


        if (name && contactNumber && address && email) {
            this.getData({ amount: subTotal, email: email, number: contactNumber, postaddress: address ,orderdetails:userselectitem}).then(response => {
                console.log(response);
                var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: response
                }
                this.post(information);
            })
        }
        else {
            alert('All are mandatory feilds, plz fill them');
        }

        e.preventDefault();
    }

   


    render() {
        const { restaurants, itemModalIsOpen, formModalIsOpen, name, contactNumber, address, email, galleryModalIsOpen, handlecartopen, addcartitem, locationModalIsOpen } = this.state;

        return (
            <React.Fragment>

                <div className="rectangle">
                    <img src={`../${restaurants.image}`} width="100%" height="400px" />

                    <div className="clickbuttongallery">
                        <button className="buttoncolor" onClick={this.handleGallery}>Click to see Image Gallery</button>
                    </div>
                </div>
                <div className="contaniner-fluid">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <h2 className="title1"><b>The Big Chill Cakery</b></h2>
                        </div>

                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <div className="nbar">
                                <ul className="nav">
                                    <li className="nav-item">
                                        <a className="nav-link  Overview  lview" data-toggle="tab" href="#home">Overview</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link Overview" data-toggle="tab" href="#menu1">Contact</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div id="home" className="container tab-pane active">
                                        <div className="title2"><b>About this Place</b></div>
                                        <div className="title3">Cuisine</div>
                                        <span className="title4">{restaurants.cuisine ? restaurants.cuisine.map((item) => item.name + ' ,') : null}</span>
                                        <div className="title5">Average Cost</div>
                                        <div className="title6">&#8377; <span>{restaurants.min_price}</span></div>
                                        <div className="title7">Rating : <Rating {...this.props} initialRating={Number(restaurants.aggregate_rating)}
                                            readonly /></div>
                                        <div className="title8">
                                            <button className="btn btn-success btn-sm " onClick={() => this.handleLocation()}><i class="fa fa-location-arrow" aria-hidden="true"></i>Location Fatch</button>
                                        </div>
                                    </div>

                                    <div id="menu1" className="container tab-pane fade">
                                        <div className="sub_title1"><b>Contanct Information</b></div>
                                        <div className="sub_title2">Name:{restaurants.name}</div>
                                        <div className="sub_title3">Mobi:{restaurants.contact_number}</div>
                                        <div className="sub_title4">Address:{restaurants.address}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="placeorderbuttonbox" >
                            <button className="Place-Online-Order" onClick={this.handleOrder}>Place Online Order</button>
                        </div>
                    </div>
                </div>

                <Modal open={itemModalIsOpen} onClose={() => this.handleModalClose('itemModalIsOpen')} center

                    classNames={{
                        overlayAnimationIn: 'customEnterOverlayAnimation',
                        overlayAnimationOut: 'customLeaveOverlayAnimation',
                        modalAnimationIn: 'customEnterModalAnimation',
                        modalAnimationOut: 'customLeaveModalAnimation',
                    }}
                    animationDuration={800}


                >

                    <div className="item-model-select">
                        <div className="The-Big-Chill-Cakery">{restaurants.name}

                        </div>

                        <div className="container-fluid">
                            {restaurants.itemList ? restaurants.itemList.map((item, index) => {
                                return <div className="row">

                                    <div className="col-sm-8 col-md-8 col-lg-8">
                                        <div>
                                            Name: {item.name}
                                        </div>
                                        <div>
                                            Price:{item.rate}
                                        </div>
                                        <div>
                                            <button className="btn btn-danger btn-sm" onClick={() => this.handlecart(index)}><i class="fa fa-shopping-cart" aria-hidden="true"></i>Add to Cart</button>
                                        </div>


                                    </div>
                                    <hr />
                                    <div className="col-sm-4 col-md-4 col-lg-4">
                                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                            {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> : <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')} className="btn-primary">-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')} className="btn-primary">+</button></div>
                                            }
                                        </div>
                                        <br />
                                        <hr />

                                    </div>
                                    <br />
                                    <hr />
                                </div>

                            }) : null}

                        </div>
                        <div className="Rectangle-3352">
                            <div>
                                <span className="Subtotal">SubTotal:  {this.state.subTotal}</span>
                                <span className="btn btn-danger btn-lg Paynow" onClick={() => this.handlePay()} >Pay Now</span>
                            </div>

                        </div>


                    </div>


                </Modal>
                <Modal open={formModalIsOpen} onClose={() => this.handleModalClose('formModalIsOpen')} center

                    classNames={{
                        overlayAnimationIn: 'customEnterOverlayAnimation',
                        overlayAnimationOut: 'customLeaveOverlayAnimation',
                        modalAnimationIn: 'customEnterModalAnimation',
                        modalAnimationOut: 'customLeaveModalAnimation',
                    }}
                    animationDuration={800}
                >

                    <div className="Web-1920-28 ">


                        <form onSubmit={this.makePayment}>
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Name</label>
                                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Akash" value={name} onChange={(event) => this.handleChange(event, 'name')} />
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlInput2">Email address</label>
                                <input type="email" class="form-control" id="exampleFormControlInput2" placeholder="name@example.com" value={email} onChange={(event) => this.handleChange(event, 'email')} />
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlInput3">Conatct Number</label>
                                <input type="number" class="form-control" id="exampleFormControlInput3" value={contactNumber} onChange={(event) => this.handleChange(event, 'contactNumber')} />
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Address</label>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={address} onChange={(event) => this.handleChange(event, 'address')}></textarea>
                            </div>
                            <input type="submit" className="btn btn-danger" value="Proceed" />

                        </form>


                    </div>
                </Modal>

                <Modal open={galleryModalIsOpen} onClose={() => this.handleModalClose('galleryModalIsOpen')} center

                    classNames={{
                        overlayAnimationIn: 'customEnterOverlayAnimation',
                        overlayAnimationOut: 'customLeaveOverlayAnimation',
                        modalAnimationIn: 'customEnterModalAnimation',
                        modalAnimationOut: 'customLeaveModalAnimation',
                    }}
                    animationDuration={800}
                >
                    <div>

                        <Carousel
                            showIndicators={false}
                            showThumbs={false}
                        >
                            {restaurants ? restaurants.thumb && restaurants.thumb.map((item) => {
                                return <div>
                                    <img src={`../${item}`} />
                                </div>
                            }) : null}
                        </Carousel>




                    </div>


                </Modal>


                <Modal open={handlecartopen} onClose={() => this.handleModalClose('handlecartopen')} center

                    classNames={{
                        overlayAnimationIn: 'customEnterOverlayAnimation',
                        overlayAnimationOut: 'customLeaveOverlayAnimation',
                        modalAnimationIn: 'customEnterModalAnimation',
                        modalAnimationOut: 'customLeaveModalAnimation',
                    }}
                    animationDuration={800}


                >
                    <div className="cart-manage">
                        <div className="container-fluid cart-item-mange" >
                            <h3 className="text-center font-weight-bold text-info">Cart-Management</h3>
                            {addcartitem.length > 0 ? addcartitem.map((item, index) => {
                                return <div className="row">

                                    <div className="col-sm-8 col-md-8 col-lg-8">
                                        <div>
                                            Name: {item.name}
                                        </div>
                                        <div>
                                            Price:{item.rate}
                                        </div>
                                        <div>
                                            <button className="btn btn-danger btn-sm" onClick={() => this.handleremovecart(index)}><i class="fa fa-shopping-basket" aria-hidden="true"></i>Remove to Cart</button>
                                        </div>
                                        <br />
                                        <div>
                                            <button className="btn btn-success btn-sm" onClick={() => this.handlebuynow()}><i class="fa fa-money" aria-hidden="true"></i>Buy Now</button>
                                        </div>



                                    </div>
                                    <hr />
                                    <div className="col-sm-4 col-md-4 col-lg-4">
                                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                        </div>
                                    </div>
                                </div>
                            }) : <div>

                                    <h1 className="text-justify">No Cart Items Are Presnt</h1></div>}

                        </div>
                    </div>


                </Modal>

                <Modal open={locationModalIsOpen} onClose={() => this.handleModalClose('locationModalIsOpen')} center

                    classNames={{
                        overlayAnimationIn: 'customEnterOverlayAnimation',
                        overlayAnimationOut: 'customLeaveOverlayAnimation',
                        modalAnimationIn: 'customEnterModalAnimation',
                        modalAnimationOut: 'customLeaveModalAnimation',
                    }}
                    animationDuration={800}


                >
                    <div className="map">
                       
                    </div>
                </Modal>








            </React.Fragment>
        )
    }
}




export default Details;