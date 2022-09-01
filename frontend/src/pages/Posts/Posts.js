import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { Link } from "react-router-dom";
import { useHttpRequest } from "../../hooks/httpRequest-hook";
import { useWindowDimensions } from "../../hooks/window-hook";

// Icons
import clockIcon from "../../images/clock-icon.svg";
import coffeeIcon from "../../images/coffee-icon.svg";
import postIcon from "../../images/post-icon.svg";

// Components
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import TabBtn from "../../components/Buttons/TabBtn/TabBtn";
import PostList from "../../components/PostList/PostList";
import Spinner from "../../components/LoadingSpinner/LoadingSpinner";

// Styles
import styles from "./Posts.module.css";

const Posts = () => {
    // Rappel du contexte d'Auth
    const auth = useContext(AuthContext);

    // Adaptation de la taille de l'écran (affichages différents)
    const { width } = useWindowDimensions();

    // Rappel du hook pour les requêtes Http
    const { isLoading, error, sendRequest, clearError } = useHttpRequest();

    // Contrôleur d'état du state Post
    const [posts, setPosts] = useState();

    // Tab Btn State
    const [activeBtn, setActiveBtn] = useState({
        mostRecents: "active",
        mostLiked: "",
    });

    // Initialisation du Get Posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsData = await sendRequest(`${process.env.REACT_APP_API_URL}/posts`, "GET", null, {
                    Authorization: "Bearer " + auth.token,
                });
                setPosts(postsData);
            } catch (err) {}
        };
        fetchPosts();
    }, [sendRequest, auth.token]);

    // Tri et affichages des posts du plus récent au plus ancien
    const fetchMostRecent = async () => {
        setActiveBtn({
            mostRecents: "active",
            mostLiked: "",
        });
        try {
            const postsData = await sendRequest(`${process.env.REACT_APP_API_URL}/posts`, "GET", null, {
                Authorization: "Bearer " + auth.token,
            });
            setPosts(postsData);
        } catch (err) {}
    };

    // Tri et affichage des posts du plus liké au moins liké
    const fetchMostLiked = async () => {
        setActiveBtn({
            mostRecents: "",
            mostLiked: "active",
        });
        try {
            const postsData = await sendRequest(`${process.env.REACT_APP_API_URL}/posts/most-liked`, "GET", null, {
                Authorization: "Bearer " + auth.token,
            });
            setPosts(postsData);
        } catch (err) {}
    };

    // Delete POST Handler
    const deletePostHandler = (deletedPostId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== deletedPostId));
    };    

    // Update POST Handler
    const updatePostHandler = (updatedPostId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== updatedPostId));
    };
    

    // Affichage menu post en desktop
    let newPost;

    if (width >= 1024) {
        newPost = (
            <Link to={`posts/new`} className={styles.btn}>
                <span className={styles.text}>CRÉER UN POST</span>
                <img className={styles.icon} src={postIcon} alt="" />
            </Link>
        );
    }

    return (
        <>
            <ErrorBox error={error} onClear={clearError} />
            <nav className={styles.header}>
                <TabBtn name="RÉCENTS" icon={clockIcon} active={activeBtn.mostRecents} onClick={fetchMostRecent} />
                <TabBtn name="POPULAIRES" icon={coffeeIcon} active={activeBtn.mostLiked} onClick={fetchMostLiked} />
                {newPost}
            </nav>
            <div className="container">
                {isLoading && (
                    <div className="spinner">
                        <Spinner />
                    </div>
                )}
                {!isLoading && activeBtn && posts && <PostList items={posts} onDeletePost={deletePostHandler} onUpdatePost={updatePostHandler}/>}
            </div>
        </>
    );
};

export default Posts;