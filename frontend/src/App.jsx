//import React, { useState } from "react";
//import Axios from "axios";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth } from "./hooks/auth-hook";
import { AuthContext } from "./context/auth-context";

//Pages
import Layout from "./pages/Layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/SignUp";
import Menu from "./pages/Menu/Menu";
import Posts from "./pages/Posts/Posts";
import NewPost from "./pages/NewPost/NewPost";
import UserProfile from "./pages/UserProfile/UserProfile";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
import UpdatePost from "./pages/UpdatePost/UpdatePost";

import "./App.css"; 

const App = () => {
    const { userId, token, account, login, logout } = useAuth();

    let routes;

    if (token) {
        routes = (
            <Switch>
                <Route path="/posts" exact component={Posts} />
                <Route path="/menu" exact component={Menu} />
                <Route path="/posts/new" exact component={NewPost} />
                <Route path="/posts/:id/update" exact component={UpdatePost} />
                <Route path="/profile/:id" exact component={UserProfile} />
                <Route path="/profile/:id/update" exact component={UpdateProfile} />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" exact component={Login} />
                <Route path="/signup" exact component={Signup} />                
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                userId: userId,
                account: account,
                login: login,
                logout: logout,
            }}
        >
            <Layout>{routes}</Layout>
        </AuthContext.Provider>
    );
};

/*function App() {
    const { emailReg, setEmailReg } = useState('');
    const { passwordReg, setPasswordReg } = useState('');

    const signup = () => {
        Axios.post('http://localhost:4200/signup', {
            email: emailReg,
            password: passwordReg,
        }).then((response) => {
            console.log(response);
        });
    };

    return (
        <div className="App">
            <div className="registration">
                <h1>Signup</h1>
                <label>Email</label>
                <input
                    type="text" 
                    onChange={(e) => {
                        setEmailReg(e.target.value);
                    }}
                />
                <label>Password</label>
                <input 
                    type="password"
                    onChange={(e) => {
                        setPasswordReg(e.target.value);
                    }}
                />
                <button onClick={signup}> Signup </button>
            </div>
            <div>
                <h1>Login</h1>
                <input type="text" placeholder="Email..." />
                <input type="password" placeholder="Password..." />
                <button> Signup </button>
            </div>
        </div>
    )
};*/

export default App;