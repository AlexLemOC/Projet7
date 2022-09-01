import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useHttpRequest } from "../../hooks/httpRequest-hook";
import { useForm } from "../../hooks/form-hook";
import { MinLength, MaxLength} from "../../utils/validators";
import { useWindowDimensions } from "../../hooks/window-hook";

// Icons
import backIcon from "../../images/back-icon.svg";

// Components
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import SelectField from "../../components/SelectField/SelectField";
import UIBtn from "../../components/Buttons/UIBtn/UIBtn";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import InputField from "../../components/InputField/InputField";
import Spinner from "../../components/LoadingSpinner/LoadingSpinner";

// Styles
import styles from "./UpdatePost.module.css";

const UpdatePost = (props) => {
    // Authentication context
    const auth = useContext(AuthContext);

    // History context
    const history = useHistory();

    // Window Size
    const { width } = useWindowDimensions();

    // Backend Request Hook
    const { isLoading, error, sendRequest, clearError } = useHttpRequest();

    // Id du post à afficher
    const PostId = Number(useParams().id);
    console.log(PostId);

    // Post useState
    const [postDataState, setPostDataState] = useState();

    //Categories State
    const [categories, setCategories] = useState();

    // Form useState
    const [formState, inputHandler, setFormState] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            category: {
                value: "",
                isValid: false,
            },
            image: {
                value: null,
                isValid: false,
            },
        },
        false
    );

    // Fetch Post et initialiser le formState
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postData = await sendRequest(
                    `${process.env.REACT_APP_API_URL}/posts/${PostId}`,
                    "GET",
                    null,
                    {
                        Authorization: "Bearer " + auth.token,
                    }
                );
                setPostDataState(postData);
                setFormState(
                    {
                        title: {
                            value: postData.title,
                            isValid: true,
                        },
                        category: {
                            value: postData.category,
                            isValid: true,
                        },
                        image: {
                            value: postData.photo_url,
                            isValid: false,
                        },
                    },
                    true
                );
            } catch (err) {}
        };
        fetchPost();
    }, [sendRequest, PostId, auth.token, setFormState]);

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

    // Mettre à jour les données du post
    const updatePostHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("title", formState.inputs.title.value);
        formData.append("category", formState.inputs.category.value);
        formData.append("image", formState.inputs.image.value);
        try {
            if (window.confirm("Voulez-vous valider ces nouvelles informations ?")) {
                await sendRequest(`${process.env.REACT_APP_API_URL}/posts/update`, "PATCH", formData, {
                    Authorization: "Bearer " + auth.token,
                });
                history.push(`/posts/`);
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
                <UIBtn id="update-post-btn" form="update-post-form" name="Update" type="submit" btnType="valid" />
            </div>
        );
        backBtn = (
            <button className={styles.back_btn} onClick={backHandle}>
                <img className="icon_red" src={backIcon} alt="" />
            </button>
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
            {!isLoading && categories && (
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
                        <form className={styles.form} id="send-post-form" onSubmit={updatePostHandler}>
                            <InputField
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Titre ou message de la publication"
                                maxLength="100"
                                element="textarea"
                                hasLabel="no"
                                textIsWhite="no"
                                validators={[MinLength(2), MaxLength(100)]}
                                errorText="Veuillez écrire un commentaire pour votre publication"
                                onInput={inputHandler}
                                initialValue={postDataState.inputs.title.value}
                                initialValid={true}
                            />
                            <ImageUpload
                                center
                                id="image"
                                onInput={inputHandler}
                                errorText="Choisissez une image ou un gif"
                                photo_url={postDataState.photo_url}
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