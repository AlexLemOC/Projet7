import React, { useContext, useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { useHttpRequest } from "../../hooks/httpRequest-hook";
import { AuthContext } from "../../context/auth-context";

// Components
import ReactionBtn from "../../components/Buttons/ReactionBtn/ReactionBtn";
import UserHeader from "../UserHeader/UserHeader";
import Spinner from "../../components/LoadingSpinner/LoadingSpinner";

// Styles
import styles from "./Post.module.css";
//import Posts from "../../pages/Posts/Posts";

// Les likes sont gérés en local state

const Post = (props) => {
    // Contexte Auth
    const auth = useContext(AuthContext);

    // Hook vers les requêtes Http
    const { isLoading, sendRequest } = useHttpRequest();

    // useHistory pour le retour arrière après suppression
    const history = useHistory();

    // Situer les props de l'App
    const path = props.location.pathname;
    const postId = props.location.pathname.split("/")[2];

    // User Likes
    const [likesCounter, setLikesCounter] = useState(props.likes);

    // User Dislikes
    const [dislikesCounter, setDislikesCounter] = useState(props.dislikes);

    // User's reactions
    const [userReaction, setUserReaction] = useState(props.userReaction);

    // Reaction status
    const [hasReacted, setHasReacted] = useState(props.userReaction === null ? false : true);

    // Reaction Handler
    const userReactionHandler = (event) => {
        event.preventDefault();
        let reaction;

        switch (userReaction) {
            case null:
                //si on clique sur like, on incrémente
                if (event.currentTarget.name === "like") {
                    setLikesCounter(likesCounter + 1);
                    reaction = event.currentTarget.name;
                    //sinon c'est le dislike qui est cliqué, on incrémente
                } else {
                    setDislikesCounter(dislikesCounter + 1);
                    reaction = event.currentTarget.name;
                }
                setUserReaction(event.currentTarget.name);
                //On indique qu'il a déjà réagit 
                setHasReacted(true);

                break;

            case "null":
                if (event.currentTarget.name === "like") {
                    setLikesCounter(likesCounter + 1);
                    reaction = event.currentTarget.name;
                } else {
                    setDislikesCounter(dislikesCounter + 1);
                    reaction = event.currentTarget.name;
                }
                setUserReaction(event.currentTarget.name);

                break;

            case "like":
                //Si le User a déjà liké, enlève le like
                if (event.currentTarget.name === "like") {
                    setLikesCounter(likesCounter - 1);
                    setUserReaction("null");
                    reaction = "null";
                    //S'il souhaite disliker, enlève le like et met un dislike lors du clique dislike
                } else {
                    setLikesCounter(likesCounter - 1);
                    setDislikesCounter(dislikesCounter + 1);
                    setUserReaction(event.currentTarget.name);
                    reaction = event.currentTarget.name;
                }

                break;

            case "dislike":
                //si le User a déjà disliké, enlève le dislike
                if (event.currentTarget.name === "dislike") {
                    setDislikesCounter(dislikesCounter - 1);
                    setUserReaction("null");
                    reaction = "null";
                    //S'il souhaite liker, enlève le dislike et met un like lors du clique like
                } else {
                    setLikesCounter(likesCounter + 1);
                    setDislikesCounter(dislikesCounter - 1);
                    setUserReaction(event.currentTarget.name);
                    reaction = event.currentTarget.name;
                }

                break;

            default:
                console.log("erreur de la fonction userReactionHandler");
                break;
        }

        //on récupère l'endroit de l'API où on souhaite POST la réaction
        fetch(`${process.env.REACT_APP_API_URL}/posts/reaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
                post_id: props.id,
                reaction: reaction,
                reacted: hasReacted,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return;
                }
            })
            .catch((err) => console.log(err));
    };

    // Delete Post
    const DeletePostHandler = async () => {
        try {
            if (window.confirm(`Voulez-vous vraiment supprimer ce post ?`)) {
                await sendRequest(
                    //on va chercher la partie DELETE paramétré sur la route Posts du backend
                    `${process.env.REACT_APP_API_URL}/posts/${props.id}`,
                    "DELETE",
                    JSON.stringify({ image_url: props.image_url }),
                    {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + auth.token,
                    }
                );
                if (path === `/posts/${postId}`) {
                    history.push(`/posts`);
                } else {
                    props.onDelete(props.id);
                };
            }else{};
        } catch (err) {}
    };

    // Update Post
    const UpdatePostHandler = async () => {
        try {
            if (window.confirm(`Voulez-vous modifier ce post ?`)) {                
                history.push(`posts/${props.id}/update`);
                /*await sendRequest(
                    //on va chercher la partie UPDATE paramétré sur la route Posts du backend
                    `${process.env.REACT_APP_API_URL}/posts/${props.id}`,
                    "UPDATE",
                    JSON.stringify({ image_url: props.image_url}),
                    {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + auth.token,
                    }
                );
                if (path === `/posts/${postId}`) {
                    history.push(`/posts`);
                } else {
                    props.onUpdate(props.id);
                };*/
            } else {};
        } catch (err) {}
    };

    /*if (props.location.pathname === "/posts") {
        updateBlock = (
            <>
                <ReactionBtn
                    btnType="link"
                    link={props.post_link}
                    reaction={null}
                    icon="eye"
                    text="update"
                    styling={styles.eye_btn}
                />
            </>
        );
    } else {
        updateBlock = (
            <ReactionBtn
                btnType="link"
                icon="eye"
                text={props.eye}
                styling={styles.push_right}
                reaction={null}
            />
        );
    }*/

    return (
        <article id={props.post_id}>
            {isLoading && (
                <div className="spinner">
                    <Spinner asOverlay />
                </div>
            )}
            <UserHeader
                user_id={props.user_id}
                photo_url={props.photo_url}
                firstName={props.firstName}
                lastName={props.lastName}
                date={props.date}
                category={props.category}
                onDelete={DeletePostHandler}
                onUpdate={UpdatePostHandler}
            />
            <section className={styles.block}>
                <h3 className={styles.title}>{props.title}</h3>
                <img className={styles.photo} src={props.image_url} alt="post" />
                <footer className={styles.reactions}>
                    <ReactionBtn
                        btnType="functional"
                        name="like"
                        onReaction={userReactionHandler}
                        reaction={userReaction === "like" ? "like" : null}
                        icon="like"
                        text={likesCounter}
                        styling=""
                    />
                    <ReactionBtn
                        btnType="functional"
                        name="dislike"
                        onReaction={userReactionHandler}
                        reaction={userReaction === "dislike" ? "dislike" : null}
                        icon="dislike"
                        text={dislikesCounter}
                        styling=""
                    />
                </footer>
            </section>
        </article>
    );
};

export default withRouter(Post);