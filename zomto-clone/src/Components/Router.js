import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Filter from './Filter';
import Details from './Details';
import NavBar from './Navbar';



function Router() {
    return (
        <BrowserRouter>
           <NavBar/>
            <Route exact path="/" component={Home} />
            <Route path="/filter" component={Filter} />
            <Route path="/details" component={Details} />
        </BrowserRouter>
    )

}

export default Router;