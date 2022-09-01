import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

// Static Images
import GenProfile from "../../images/generic_profile_picture.jpg";

// Icons
import DeleteX from "../../images/x-icon.svg";
import Eye from "../../images/eye.svg";

// Styles
import styles from "./UserHeader.module.css";
const UserHeader = (props) => {
    // Authentication context
    const auth = useContext(AuthContext);

    // Format de la date de la publication en sec, min, heurs, jours et années
    const postDate = new Date(props.date);
    const today = new Date();
    const diffTime = Math.abs(today - postDate);

    let newPostDate;

    //en dessous d'une minute
    if (diffTime <= 6000) {
        const formatDate = Math.ceil(diffTime / 1000) + " s";
        newPostDate = formatDate;
    }

    //en dessous d'une heure
    if (diffTime >= 60000) {
        const formatDate = Math.ceil(diffTime / (1000 * 60)) + " m";
        newPostDate = formatDate;
    }

    //en dessous d'un jour
    if (diffTime >= 3600000) {
        const formatDate = Math.ceil(diffTime / (1000 * 60 * 60)) + " h";
        newPostDate = formatDate;
    }

    //en dessous d'un an
    if (diffTime >= 216000000) {
        const formatDate = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + " j";
        newPostDate = formatDate;
    }
    
    //un an et plus
    if (diffTime >= 189216000000) {
        const formatDate = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365)) + " a";
        newPostDate = formatDate;
    }

    // Afficher la catégorie du post
    let category;

    if (props.category) {
        category = (
            <>
                <span className={styles.text_division}>|</span>
                <span>{props.category}</span>
            </>
        );
    } else {
        category = "";
    }

    // Si le User est Admin ou propriétaire du post, faire apparaître le bouton DELETE
    let deleteBtn;

    if (auth.userId === props.user_id || auth.account === "admin") {
        deleteBtn = (
            <button className={styles.delete_btn} onClick={props.onDelete}>
                <img className={styles.delete_icon} src={DeleteX} alt="delete icon" />
            </button>
        );
    } else {
        deleteBtn = "";
    }

    let updateBtn;

    if (auth.userId === props.user_id || auth.account === "admin") {
        updateBtn = (
            <button className={styles.delete_btn} onClick={props.onUpdate}>
                <img className={styles.delete_icon} src={Eye} alt="eye icon" />
            </button>
        );
    } else {
        updateBtn = "";
    }

    return (
        <header className={styles.block}>
            <Link to={`/profile/${props.user_id}`}>
                <img
                    className={styles.photo}
                    src={props.photo_url || GenProfile}
                    alt={`${props.firstName} ${props.lastName}`}
                />
                {props.firstName} {props.lastName}
            </Link>
            <p className={styles.text}>
                {category}
                <span className={styles.text_division}>•</span>
                <span>{newPostDate}</span>
            </p>
            {updateBtn}
            {deleteBtn}
        </header>
    );
};

export default UserHeader;