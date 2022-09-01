import React from "react";

// Static Images
import logo from "../../images/logo.png";

// Styles
import "./Home.css";

const Home = () => {
    return (
        <div className="waveWrapper">
            <div className="background_image">
                <img src={logo} className="logo" alt="Logo de Groupomania, entreprise de grande distribution européenne" />
                <div className="welcome">
                    <h3 className="title">Bienvenue</h3>
                    <p className="message">Surfez sur ce réseau social professionnel avec vos collègues !</p>
                </div>
            </div>
            <div className="ocean">
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
        </div>
    );
};

export default Home;