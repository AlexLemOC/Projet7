import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useForm } from "../../hooks/form-hook";
import { useParams } from "react-router-dom";
import { useWindowDimensions } from "../../hooks/window-hook";
import { useHttpRequest } from "../../hooks/httpRequest-hook";
import { MinLength, MaxLength } from "../../utils/validators";

// icons
import backIcon from "../../images/back-icon.svg";
//import modify from "../../images/modify-icon.svg";

// Components
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import UIBtn from "../../components/Buttons/UIBtn/UIBtn";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import SelectField from "../../components/SelectField/SelectField";
import InputField from "../../components/InputField/InputField";
//import NavBtn from "../../components/Buttons/NavBtn/NavBtn";
import Spinner from "../../components/LoadingSpinner/LoadingSpinner";

// Styles
import styles from "./UpdatePost.module.css";
//import Posts from "../Posts/Posts";

const UpdatePost = (props) => {
    // Authentication context
    const auth = useContext(AuthContext);

    // History context
    const history = useHistory();

    // Request Hook
    const { isLoading, error, sendRequest, clearError } = useHttpRequest();

    // Window Size
    const { width } = useWindowDimensions();

    // Situer les props de l'App
    //const postId = props.location.pathname.split("/")[2];

    // Post useState
    const [postDataState, setPostDataState] = useState();

    // Id du post à afficher
    const postId = Number(useParams().id);
    //console.log(postId);

    //Categories State
    const [categories, setCategories] = useState();

    // Form State //ajouter setFormState si on fetch les info dans un form
    const [formState, inputHandler, setFormState] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            category: {
                value: null,
                isValid: false,
            },
            image: {
                value: null,
                isValid: false,
            },
        },
        false
    );

    //Fetch Categories
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const categories = await sendRequest(`${process.env.REACT_APP_API_URL}/posts/categories`, "GET", null, {
                    Authorization: "Bearer " + auth.token,
                });

                setCategories(categories);
            } catch (err) {}
        };
        fetchPosts();
    }, [sendRequest, auth.token, setCategories]);

    //Récupération des info du post avec l'id
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const postDataState = await sendRequest(
                    `${process.env.REACT_APP_API_URL}/posts/${postId}`,
                    "GET",
                    null,
                    {
                        Authorization: "Bearer " + auth.token,
                    }
                );
                setPostDataState(postDataState);
                setFormState(
                    {
                        title: {
                            value: postDataState[0].title,
                            isValid: true,
                        },
                        category: {
                            value: postDataState[0].category,
                            isValid: true,
                        },
                        image: {
                            value: postDataState[0].image_url,
                            isValid: false,
                        },
                    },
                    true
                );
                console.log(postDataState[0].title);
            } catch (err) {}
        };
        fetchInfo();
    }, [sendRequest, postId, auth.token, setFormState]);

    const updatePostHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("title", formState.inputs.title.value);
        console.log(formState.inputs.title.value);
        formData.append("category", formState.inputs.category.value);
        console.log(formState.inputs.category.value);
        formData.append("image", formState.inputs.image.value);
        formData.append("postId", postId);

        //Insert HOC

        try {
            if (window.confirm("Voulez-vous valider ces nouvelles informations ?")) {
                await sendRequest(`${process.env.REACT_APP_API_URL}/posts/update`, "PATCH", formData, {
                    Authorization: "Bearer " + auth.token,
                });
                history.push(`/posts`);
            }else{}
        } catch (err) {}
    };

    // Back Button
    const backHandle = (e) => {
        e.preventDefault();
        props.history.goBack();
    };

    // Affichage des boutons pour Desktop
    let sendBtn;
    let backBtn;

    if (width >= 1024) {
        sendBtn = (
            <div className={styles.send_btn}>
                <UIBtn id="updatePost-btn" form="update-form" name="Update" type="submit" btnType="valid" />
            </div>
        );
        backBtn = (
            <button className={styles.back_btn} onClick={backHandle}>
                <img className="icon_red" src={backIcon} alt="" />
            </button>
        );
    } else if(width <= 1024) {
        sendBtn = (
            <div className={styles.send_btnMini}>
                <UIBtn id="updatePost-btn" form="update-form" name="Update" type="submit" btnType="valid" />
            </div>
        );
        backBtn = (
            <button className={styles.back_btnMini} onClick={backHandle}>
                <img className="icon_white" src={backIcon} alt="" />
                <p className={styles.return_p}>Retour</p>
            </button>
        );
    }

    /*let btnStyle = styles.btnStyle;
    let iconStyle = `${styles.iconStyle} icon_red`;
    let desktopNav;

    // Affichage Nav Desktop
    if (width >= 1024) {
        desktopNav = (
            <nav className={styles.nav}>
                <NavBtn
                    id="back"
                    name="retour"
                    icon={backBtn}
                    link="/posts"
                    btnStyle={btnStyle}
                    iconColor={iconStyle}
                />
            </nav>
        );
    }

    // Adaptation de l'écran en mode desktop
    if (width <= 1024) {
        desktopNav = (
            <nav className={styles.nav}>
                <NavBtn
                    id="back"
                    name="retour"
                    icon={backBtn}
                    link="/posts"
                    btnStyle={btnStyle}
                    iconColor={iconStyle}
                />
                <NavBtn
                    id="update-post"
                    name="Modifier"
                    icon={modify}
                    link={`/posts/${postId}/update`}
                    btnStyle={btnStyle}
                    iconColor={iconStyle}
                />
            </nav>
        );
    }*/

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className="spinner">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (!categories) {
        return (
            <>
                <ErrorBox error={error} onClear={clearError} />
                <div className={styles.container}>
                    <h2>Choisissez une catégorie</h2>
                </div>
            </>
        );
    }

    if (!postDataState) {
        return (
            <>
                <ErrorBox error={error} onClear={clearError} />
                <div className={styles.container}>
                    <h2>No Post Data!</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <ErrorBox error={error} onClear={clearError} />
            {!isLoading && categories && postDataState &&(
                <>
                    <header className={styles.head}>
                        <div className={styles.tab}>
                            {backBtn}
                            <div className={styles.tab_border}>
                                <h3 className={styles.title}>Modifier Publication</h3>
                            </div>
                        </div>
                    </header>
                    <div className="container">
                        <form className={styles.form} id="update-form" onSubmit={updatePostHandler}>
                            <InputField
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Que dire à ce sujet ?"
                                maxLength="100"
                                element="textarea"
                                hasLabel="no"
                                textIsWhite="no"
                                validators={[MinLength(2), MaxLength(100)]}
                                errorText="Veuillez écrire un commentaire pour votre publication"
                                onInput={inputHandler}
                                initialValue={postDataState[0].title}
                                initialValid={true}
                            />
                            <ImageUpload
                                center
                                id="image"
                                onInput={inputHandler}
                                errorText="Choisissez une image ou un gif"
                                image_url={postDataState[0].image_url}
                            />
                            <SelectField
                                id="category"
                                label="Catégories :"
                                name="catégories"
                                onInput={inputHandler}
                                options={categories}
                                errorText="Choisissez une catégorie"
                            />
                            
                        </form>
                        {sendBtn}
                    </div>
                </>
            )}
        </>
    );
};

export default UpdatePost;