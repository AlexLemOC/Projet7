import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useHttpRequest } from "../../hooks/httpRequest-hook";
import { AuthContext } from "../../context/auth-context";
import { useWindowDimensions } from "../../hooks/window-hook";

// Penser à faire un user profile avec une image de base vide
import BlankProfile from "../../images/generic_profile_picture.jpg";

// Import des SVG pour les boutons
import person from "../../images/person-icon.svg";
import agenda from "../../images/agenda-icon.svg";
import categories from "../../images/categories-icon.svg";
import logout from "../../images/logout-icon.svg";
import posts from "../../images/posts-icon.svg";

// Components : insérer des messages d'erreur ?
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import Spinner from "../../components/LoadingSpinner/LoadingSpinner";
//import Move3D from "../../components/Move3D/Move3D";

// Styles
import styles from "./Menu.module.css";

const Menu = () => {
    // Authentication context
    const auth = useContext(AuthContext);

    // Backend Request Hook
    const { isLoading, error, sendRequest, clearError } = useHttpRequest();

    // Window Size
    const { width } = useWindowDimensions();

    // History context
    const history = useHistory();

    //Profile Hook
    const [profileData, setProfileData] = useState();

    //Fetch Most recent posts
    useEffect(() => {
        let mounted = true;

        if (auth.token && auth.userId) {
            const fetchPosts = async () => {
                try {
                    const userData = await sendRequest(
                        `${process.env.REACT_APP_API_URL}/profile/${auth.userId}`,
                        "GET",
                        null,
                        {
                            Authorization: "Bearer " + auth.token,
                        }
                    );
                    if (mounted) {
                        setProfileData(userData);
                    }
                } catch (err) {}
            };
            fetchPosts();
        }

        return () => (mounted = false);
    }, [sendRequest, auth.token, auth.userId, setProfileData]);

    const logoutHandler = (event) => {
        event.preventDefault();
        auth.logout();
        history.push(`/`);
    };

    // Affichage Navlinks en desktop
    let navLinks;
    if (width >= 1024) {
        navLinks = (
            <>
                <Link to="/posts" className={`${styles.btn} ${styles.border}`}>
                    <span className={styles.text}>Publications</span>
                    <img className={`${styles.icon} icon_white`} src={posts} alt="" />
                </Link>
                <Link to="/posts" className={`${styles.btn} ${styles.border}`}>
                    <span className={styles.text}>Catégories</span>
                    <img className={`${styles.icon} icon_white`} src={categories} alt="" />
                </Link>
            </>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className="spinner">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <>
                <ErrorBox error={error} onClear={clearError} />
                <div className={styles.container}>
                    <h2>Pas d'information pour le moment.</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <ErrorBox error={error} onClear={clearError} />
            <>
                {!isLoading && profileData && (
                    <div className={styles.cover}>
                        <div className={styles.background_img}></div>
                        <div className={styles.wrapper}>
                            <img
                                src={profileData.photo_url || BlankProfile}
                                className={styles.profile_photo}
                                alt={`${profileData.firstName} ${profileData.lastName}`}
                            />
                            <div className={styles.hero_block}>
                                <h2 className={styles.title}>Bienvenue {profileData.firstName} !</h2>
                            </div>
                        </div>
                        <nav className={styles.list}>
                            <Link to={`profile/${auth.userId}`} className={`${styles.btn} ${styles.border}`}>
                                <span className={styles.text}>Mon profil</span>
                                <img className={`${styles.icon} icon_white`} src={person} alt="" />
                            </Link>
                            {navLinks}
                            <Link to="/posts" className={`${styles.btn} ${styles.border}`}>
                                <span className={styles.text}>Calendrier</span>
                                <img className={`${styles.icon} icon_white`} src={agenda} alt="" />
                            </Link>
                            <button className={`${styles.btn} ${styles.logout_margin}`} onClick={logoutHandler}>
                                <span className={styles.text}>Se déconnecter</span>
                                <img className={`${styles.icon} icon_white`} src={logout} alt="" />
                            </button>
                        </nav>
                    </div>
                )}
            </>
        </>
    );
};

export default Menu;