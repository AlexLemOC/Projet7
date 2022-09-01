import React from "react";
import { Link } from "react-router-dom";

// Icons
import like from "../../../images/like-icon.svg";
import dislike from "../../../images/dislike-icon.svg";
import eye from "../../../images/eye.svg";

// Styles
import styles from "./ReactionBtn.module.css";

const ReactionBtn = (props) => {
    // Couleur du bouton like/dislike en fonction de la reaction de l'utilisateur
    let reactionColor = "";

    switch (props.reaction) {
        case "like":
            reactionColor = "icon_green";
            break;
        case "dislike":
            reactionColor = "icon_red";
            break;
        case null:
            reactionColor = "";
            break;
        default:
            console.log("Erreur sur les couleurs de boutons réaction");
    }

    // Import icône like et dislike
    let icon;
    switch (props.icon) {
        case "like":
            icon = like;
            break;
        case "dislike":
            icon = dislike;
            break;
        case "eye":
            icon = eye;
            break;
        default:
            console.log("Erreur sur les icônes réactions");
    }

    // Type de bouton à montrer
    let btn;
    switch (props.btnType) {
        case "functional":
            btn = (
                <button
                    name={props.name}
                    className={`${styles.reaction_btn} ${props.styling}`}
                    onClick={props.onReaction}
                >
                    <img className={`${styles.icon} ${reactionColor}`} src={icon} alt="" />
                    <span>{props.text}</span>
                </button>
            );
            break;
        case "link":
            btn = (
                <Link to={props.link} className={`${styles.reaction_btn} ${props.styling}`}>
                    <img className={`${styles.icon} ${reactionColor}`} src={icon} alt="" />
                    <span>{props.text}</span>
                </Link>
            );
            break;
        case "decor":
            btn = (
                <div className={`${styles.reaction_btn} ${props.styling}`}>
                    <img className={`${styles.icon} ${reactionColor}`} src={icon} alt="" />
                    <span>{props.text}</span>
                </div>
            );
            break;
        default:
            console.log("Erreur sur les composants réactions");
    }

    return <>{btn}</>;
};

export default ReactionBtn;