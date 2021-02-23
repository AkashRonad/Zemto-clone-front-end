import React from 'react';
import '../Styles/Navbar.css';
import { withRouter } from 'react-router';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import GoogleLogin from 'react-google-login';
import axios from 'axios';


class NavBar extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            loggedInUser: undefined,
            signModalIsOpen: false,
            email: '',
            password: '',
            user: [],
            message: undefined,
            registerModalIsOpen: false,
            profileimageUrl:undefined
           
        }
    }
    handlelogo = () => {
        this.props.history.push("/");

    }
    handleModalClose = (state) => {
        this.setState({ [state]: false });
    }

    handlelogin(event) {
        this.setState({ loginModalIsOpen: true });
        event.preventDefault();

    }






    responseGoogle = (response) => {
        this.setState({ loggedInUser: response.profileObj.name, loginModalIsOpen: false,profileimageUrl:response.profileObj.imageUrl })
    }
    handleLogout = () => {
        this.setState({ loggedInUser: undefined })
    }

    handleLogout1 = () => {
        this.setState({ user: [] })
    }




    handlesign() {
        this.setState({ signModalIsOpen: true });

    }


    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    handleSubmit = (event) => {
        const { email, password } = this.state;

        if (email && password) {
            var email1 = email;
            const obj = {
                email: email,
                password: password.toString()
            }
            // Payment API Call

            axios({
                method: 'POST',
                url: 'https://zomoto-clone-backend-code-api.herokuapp.com/login',
                headers: { 'Content-Type': 'application/json' },
                data: obj
            }).then(response => {
                console.log(response)
                var mess1 = response.data.message;
                if (mess1.toString() == "Sign in Succesfully") {
                    var email2 = response.data.user.map(item => item.email);

                } else {
                    alert("plz check your userid and password");
                }


                if (email2.toString() === email1.toString()) {
                    this.setState({ user: response.data.user, signModalIsOpen: false, loginModalIsOpen: false, message: response.data.message })

                }


            }).catch(error => console.log(error))

        }
        else {
            alert('All are mandatory feilds, plz fill them');
        }
        event.preventDefault();
    }

    handleRegister = () => {
        this.setState({ registerModalIsOpen: true });

    }


    handleSubmit1 = (event) => {
        const { email, password } = this.state;

        if (email && password) {
            const obj = {
                email: email,
                password: password.toString()
            }
            // Payment API Call

            axios({
                method: 'POST',
                url: 'https://zomoto-clone-backend-code-api.herokuapp.com/register',
                headers: { 'Content-Type': 'application/json' },
                data: obj
            }).then(response => {
                var mess = response.data.meassage;
                console.log(mess.toString())
                if(mess.toString()==='User Register Succesfully'){
                    alert("Register Succesfully with email id"+ " : "+email);

                }else{
                    alert("this  email id is alredy register plz go and login directly ");

                }



            }).catch(error => console.log(error))

        }
        else {
            alert('All are mandatory feilds, plz fill them');
        }
        event.preventDefault();
    }















    render() {
        const { loginModalIsOpen, loggedInUser, signModalIsOpen, email, password, user, registerModalIsOpen,profileimageUrl} = this.state;
        return (
            <React.Fragment>
                <div class="topbar">
                    <div class="logo" onClick={() => this.handlelogo()}>
                        <b >e!</b>
                    </div>
                    <div class="hlogin">


                        {loggedInUser  ? <div className="Login1">{loggedInUser}
                        <img className="rounded-circle mt-5 n-imag" src={profileimageUrl} width="35"  />
                            <div className="Login2" onClick={this.handleLogout}>LogOut</div></div> :
                            <a className="Login" onClick={(e) => this.handlelogin(e)}>Login</a>}

                        {user.length != 0 ? <div className="Login1">{user.map(item => item.email)}
                            <div className="Login3" onClick={this.handleLogout1}>LogOut</div></div> :
                            null}



                        {loggedInUser || user.length > 0 ? <div></div> : <a class="Register" onClick={() => this.handleRegister()}>Register</a>}




                    </div>
                </div>
                <Modal open={loginModalIsOpen} onClose={() => this.handleModalClose('loginModalIsOpen')} center

                    classNames={{
                        overlayAnimationIn: 'customEnterOverlayAnimation',
                        overlayAnimationOut: 'customLeaveOverlayAnimation',
                        modalAnimationIn: 'customEnterModalAnimation',
                        modalAnimationOut: 'customLeaveModalAnimation',
                    }}
                    animationDuration={800}
                >


                    <div className="Rectangle-3338">

                        <div>
                            <h2 className="Login-top-pop">
                                Login
                            </h2>
                        </div>

                        <div className="Signinbutton-Setup">

                            <GoogleLogin
                                clientId="36357988154-fpdeduqtpls3tqvqq89oad55nnvbhhgj.apps.googleusercontent.com"
                                buttonText="Google-login Button"
                                onSuccess={this.responseGoogle}
                                className="button-google"



                            />

                            <div className="Signinbutton-Setup1">

                                <button className="btn btn-outline-dark btn-lg button-google1 " onClick={() => this.handlesign()}>Login</button>

                            </div>
                        </div>

                    </div>
                </Modal>


                <Modal open={signModalIsOpen} onClose={() => this.handleModalClose('signModalIsOpen')} center

                    classNames={{
                        overlayAnimationIn: 'customEnterOverlayAnimation',
                        overlayAnimationOut: 'customLeaveOverlayAnimation',
                        modalAnimationIn: 'customEnterModalAnimation',
                        modalAnimationOut: 'customLeaveModalAnimation',
                    }}
                    animationDuration={800}
                >

                    <div className="Web-1920-29 ">


                        <form onSubmit={this.handleSubmit}>
                            <div class="form-group">
                                <label for="exampleFormControlInput2">Email address</label>
                                <input type="email" class="form-control" id="exampleFormControlInput2" placeholder="name@example.com" value={email} onChange={(event) => this.handleChange(event, 'email')} />
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlInput3">password</label>
                                <input type="password" class="form-control" id="exampleFormControlInput3" min="1" max="10" value={password} onChange={(event) => this.handleChange(event, 'password')} />
                            </div>
                            <input type="submit" className="btn btn-danger  btn-lg" value="Login" />

                        </form>


                    </div>
                </Modal>



                <Modal open={registerModalIsOpen} onClose={() => this.handleModalClose('registerModalIsOpen')} center

                    classNames={{
                        overlayAnimationIn: 'customEnterOverlayAnimation',
                        overlayAnimationOut: 'customLeaveOverlayAnimation',
                        modalAnimationIn: 'customEnterModalAnimation',
                        modalAnimationOut: 'customLeaveModalAnimation',
                    }}
                    animationDuration={800}
                >

                    <div>
                        <h2 className="Login-top-pop">
                            Register
                            </h2>
                    </div>

                    <div className="Web-1920-29 ">
                        <form onSubmit={this.handleSubmit1}>
                            <div class="form-group">
                                <label for="exampleFormControlInput2">Email address</label>
                                <input type="email" class="form-control" id="exampleFormControlInput2" placeholder="name@example.com" value={email} onChange={(event) => this.handleChange(event, 'email')} />
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlInput3">password</label>
                                <input type="password" class="form-control" id="exampleFormControlInput3" min="1" max="10" value={password} onChange={(event) => this.handleChange(event, 'password')} />
                            </div>
                            <input type="submit" className="btn btn-danger  btn-lg" value="Register" />

                        </form>
                    
            
        


                    </div>
                </Modal>




















            </React.Fragment>

        )
    }
}

export default withRouter(NavBar);