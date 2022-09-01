"use strict";

// Middleware Imports
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const fs = require("fs"); // pour naviguer dans les fichier de l'ordinateur (file system)

// Error Class
const HttpError = require("../models/http-error");

// Database Route
const db = require("../config/db");

// UserID decoder
const decodeUid = (authorization) => {
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return {
        id: decodedToken.userId,
        clearance: decodedToken.account,
    };
};

// POST Create Posts Controller
//==========================================================================================================
exports.createPost = (req, res, next) => {
    const user = decodeUid(req.headers.authorization);
    const { title, category } = req.body;
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    // Vérification s'il y a une image dans le body
    if (req.body.image === "null") {
        return next(new HttpError("Veuillez choisir une image", 400));
    }

    // Requête
    const string = "INSERT INTO posts (Users_id, Categories_id, title, image_url) VALUES (?, ?, ?, ? )";
    const inserts = [user.id, category, title, imageUrl];
    const sql = mysql.format(string, inserts);

    const createPost = db.query(sql, (error, post) => {
        if (!error) {
            res.status(201).json({ message: "Post sauvegardé !" });
        } else {
            return next(new HttpError("Erreur de requête, la publication n'a pas été créée", 500));
        }
        console.log(imageUrl);
    });
};

// GET Post Categories Controller
//==========================================================================================================
exports.getCategories = (req, res, next) => {
    const sql = "SELECT * FROM categories";

    // Requête
    const query = db.query(sql, (error, results) => {
        if (!error) {
            res.status(200).json(results);
        } else {
            return next(new HttpError("Erreur de requête, les catégories n'ont pas pu être récupérées", 500));
        }
    });
};

// GET All Posts Controller
//==========================================================================================================
exports.getAllPosts = (req, res, next) => {
    // Obtenir l'user ID
    const user = decodeUid(req.headers.authorization);

    // Fetch liste des posts
    const getPosts = () => {
        return new Promise((resolve, reject) => {
            try {
                const string = `SELECT
                                    u.id AS user_id,
                                    u.firstName,
                                    u.lastName,
                                    u.photo_url,
                                    p.title,
                                    p.post_date,
                                    p.image_url,
                                    p.id AS post_id,
                                    c.category,
                                COUNT(if(r.reaction = 'like', 1, NULL)) AS likes,
                                COUNT(if(r.reaction = 'dislike', 1, NULL)) AS dislikes,
                                    (SELECT reaction FROM reactions WHERE Users_id = ? AND  Posts_id = r.Posts_id) AS userReaction
                                FROM posts AS p
                                LEFT JOIN reactions AS r ON p.id = r.Posts_id
                                JOIN categories AS c ON p.Categories_id = c.id
                                JOIN users AS u ON p.Users_id = u.id
                                GROUP BY p.id ORDER BY post_date DESC`;
                const inserts = [user.id];
                const sql = mysql.format(string, inserts);

                // Requête
                const getPosts = db.query(sql, (error, posts) => {
                    if (error) reject(error);
                    resolve(posts);
                });
            } catch (err) {
                reject(err);
            }
        });
    };

    // Fetch reaction par post
    const assemblePost = async () => {
        try {
            // Résultat des posts
            let finalPost = await getPosts();
            return finalPost;
        } catch (err) {
            return new Error(err);
        }
    };

    assemblePost()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((error) => {
            return next(new HttpError("Erreur de requête, les posts n'ont pas pu être récupérés", 500));
        });
};

// GET Most Liked Posts Controller
//==========================================================================================================
exports.getMostLikedPosts = (req, res, next) => {
    const user = decodeUid(req.headers.authorization);

    // Fetch les posts avec plus de likes
    const getMostLiked = () => {
        return new Promise((resolve, reject) => {
            try {
                const sqlString = `SELECT
                                        u.id AS user_id,
                                        u.firstName,
                                        u.lastName,
                                        u.photo_url,
                                        p.title,
                                        p.post_date,
                                        p.image_url,
                                        p.id AS post_id,
                                        c.category,
                                    COUNT(if(r.reaction = 'like', 1, NULL)) AS likes,
                                    COUNT(if(r.reaction = 'dislike', 1, NULL)) AS dislikes,
                                        (SELECT reaction FROM reactions WHERE Users_id = ? AND Posts_id = r.Posts_id) AS userReaction
                                    FROM posts AS p
                                    LEFT JOIN reactions AS r ON p.id = r.Posts_id
                                    JOIN categories AS c ON p.Categories_id = c.id
                                    JOIN users AS u ON p.Users_id = u.id
                                    GROUP BY p.id ORDER BY likes DESC`;
                const inserts = [user.id];
                const sql = mysql.format(sqlString, inserts);

                // Requête
                const getPosts = db.query(sql, (error, posts) => {
                    if (error) reject(error);
                    resolve(posts);
                });
            } catch (err) {
                reject(err);
            }
        });
    };

    // Fetch reaction par post
    const assemblePost = async () => {
        try {
            // Résultat des posts
            let finalPost = await getMostLiked();
            // Pour chaque post, vérifier commentaires et ajoutez-les
            for (let i = 0; i < finalPost.length; i++) {
            }
            return finalPost;
        } catch (err) {
            return new Error(err);
        }
    };

    assemblePost()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((error) => {
            return next(new HttpError("Erreur de requête, les publications n'ont pas pu être récupérées", 500));
        });
};

// GET One Posts Controller
//==========================================================================================================
exports.getOnePost = (req, res, next) => {
    const user = decodeUid(req.headers.authorization);
    const id = req.params.id;

    /*const postSql = `SELECT
                        u.id AS user_id,
                        u.firstName,
                        u.lastName,
                        u.photo_url,
                        p.title,
                        p.post_date,
                        p.image_url,
                        p.id AS post_id,
                        c.category,
                    COUNT(if(r.reaction = 'like', 1, NULL)) AS likes,
                    COUNT(if(r.reaction = 'dislike', 1, NULL)) AS dislikes,
                        (SELECT reaction FROM reactions WHERE Users_id = ? AND Posts_id = r.Posts_id) AS userReaction
                    FROM posts AS p
                    LEFT JOIN reactions AS r ON p.id = r.Posts_id
                    JOIN categories AS c ON p.Categories_id = c.id
                    JOIN users AS u ON p.Users_id = u.id
                    WHERE p.id = ?
                    GROUP BY p.id `;

    db.query(`${postSql}; `, [user.id], (error, result, fields) => {
        if (!error) {
            // "results" tableau avec les posts
            let results = [
                {
                    // copier le résultat du post
                    ...result[0],
                },
            ];
            res.status(200).json(results);
        } else {
            return next(new HttpError("Erreur de requête, le post n'a pas pu être récuperé", 500));
        }
    });
};*/

    const getPost = () => {
        return new Promise((resolve, reject) => {
            try {
                const postString = `SELECT
                                    u.id AS user_id,
                                    u.firstName,
                                    u.lastName,
                                    u.photo_url,
                                    p.title,
                                    p.post_date,
                                    p.image_url,
                                    p.id AS post_id,
                                    c.category,
                                COUNT(if(r.reaction = 'like', 1, NULL)) AS likes,
                                COUNT(if(r.reaction = 'dislike', 1, NULL)) AS dislikes,
                                    (SELECT reaction FROM reactions WHERE Users_id = ? AND  Posts_id = r.Posts_id) AS userReaction
                                FROM posts AS p
                                LEFT JOIN reactions AS r ON p.id = r.Posts_id
                                JOIN categories AS c ON p.Categories_id = c.id
                                JOIN users AS u ON p.Users_id = u.id
                                WHERE p.id = ${id}
                                GROUP BY p.id`;
                //const postString = `SELECT * FROM posts WHERE id = ?`
                const inserts = [user.id, id];
                const sql = mysql.format(postString, inserts);

                // Requête
                const getPost = db.query(sql, (error, posts) => {
                    if (error) reject(error);
                    resolve(posts);
                });
            } catch (err) {
                reject(err);
            }
        });
    };
    // Fetch reaction par post
    const assemblePost = async () => {
        try {
            // Résultat du post
            let finalPost = await getPost();
            return finalPost;
        } catch (err) {
            return new Error(err);
        }
    };

    assemblePost()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((error) => {
            return next(new HttpError("Erreur de requête, le post n'a pas pu être récupéré", 500));
        });
};

// POST Reactions to posts Controller
//==========================================================================================================
exports.postReaction = (req, res, next) => {
    const user = decodeUid(req.headers.authorization);
    const { reaction, post_id, reacted } = req.body;

    console.log("frontend info =>", req.body);

    switch (reaction) {
        case "like": // Like Post
            try {
                let string;
                if (!reacted) {
                    string = "INSERT INTO reactions (Posts_id, Users_id, reaction) VALUES (?, ?, 'like')";
                } else {
                    string = "UPDATE reactions SET reaction = 'like' WHERE Posts_id = ? AND Users_id = ?";
                }
                const inserts = [post_id, user.id];
                const sql = mysql.format(string, inserts);

                const likePost = db.query(sql, (error, result) => {
                    if (error) throw error;
                    res.status(200).json({ message: "réaction like enregistrée !" });
                });
            } catch (err) {
                return next(
                    new HttpError("Erreur de requête, votre reaction à la publication n'a pas pu être enregistré", 500)
                );
            }

            break;
        case "dislike": // Dislike Post
            try {
                let string;
                if (!reacted) {
                    string = "INSERT INTO reactions (Posts_id, Users_id, reaction) VALUES (?, ?, 'dislike')";
                } else {
                    string = "UPDATE reactions SET reaction = 'dislike' WHERE Posts_id = ? AND Users_id = ?";
                }
                const inserts = [post_id, user.id];
                const sql = mysql.format(string, inserts);

                const dislikePost = db.query(sql, (error, result) => {
                    if (error) throw error;
                    res.status(200).json({ message: "réaction dislike enregistrée !" });
                });
            } catch (err) {
                return next(
                    new HttpError("Erreur de requête, votre reaction à la publication n'a pas pu être enregistré", 500)
                );
            }
            break;
        case "null": // Like ou Dislike Post
            try {
                const string = "UPDATE reactions SET reaction = 'null' WHERE Posts_id = ? AND Users_id = ?";
                // const string = "DELETE FROM reactions WHERE Posts_id = ? and Users_id = ?";
                const inserts = [post_id, user.id];
                const sql = mysql.format(string, inserts);

                const updateReaction = db.query(sql, (error, result) => {
                    if (error) throw error;
                    res.status(200).json({ message: "reaction mise à jour!" });
                });
            } catch (err) {
                return next(
                    new HttpError("Erreur de requête, votre reaction à la publication n'a pas pu être enregistré", 500)
                );
            }
            break;
    }
};

// DELETE Posts Controller
//==========================================================================================================
exports.deletePost = (req, res, next) => {
    const user = decodeUid(req.headers.authorization);

    let string = "";
    let inserts = [];
    const imagePath = `./images/${req.body.image_url.split("/")[4]}`;

    // Vérification si c'est l'admin ou l'utilisateur même
    if (user.clearance === "admin") {
        string = "DELETE FROM posts WHERE id = ?";
        inserts = [req.params.id];
        console.log("admin");
    } else {
        string = "DELETE FROM posts WHERE id = ? AND Users_id = ?";
        inserts = [req.params.id, user.id];
        console.log("user");
    }
    const sql = mysql.format(string, inserts);

    // Requête
    const deletePost = db.query(sql, (error, result) => {
        if (!error) {
            // Supprimer l'image dans le serveur
            fs.unlink(imagePath, (err) => {
                console.log(err);
            });
            res.status(200).json({ message: "Post deleted successfully!" });
        } else {
            return next(new HttpError("Erreur de requête, la publication n'a pas pu être supprimée", 500));
        }
    });
};

// UPDATE Posts Controller
//==========================================================================================================
exports.updatePost = (req, res, next) => {
    //const user = decodeUid(req.headers.authorization);
    const { title, category } = req.body;
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    const postId = req.body.postId;

    /*let string = "";
    let inserts = [];
    const imagePath = `./images/${req.body.image_url.split("/")[4]}`;*/

    // Vérification si c'est l'admin ou l'utilisateur même
    /*if (user.clearance === "admin") {
        string = "UPDATE posts SET Users_id = ?, Categories_id = ?, title = ?, image_url = ? WHERE id = ?";
        inserts = [req.params.id, category, title, imageUrl];
        console.log("admin");
    } else {
        string = "UPDATE posts SET Users_id = ?, Categories_id = ?, title = ?, image_url = ? WHERE id = ? AND users_id = ?";
        inserts = [req.params.id, category, title, imageUrl, user.id];
        console.log("user");
    }*/

    if (title && category && imageUrl) {
        const string = 
            `UPDATE posts SET title = ?, categories_id = ?, image_url = ? WHERE id = ${postId}`;
        const inserts = [title, category, imageUrl, postId];
        const sql = mysql.format(string, inserts);
        console.log(req.body.postId);

        // Requête
        const updatePost = db.query(sql, (error, update) => {
            if (!error) {
                res.status(200).json({message: "Mise à jour effectuée avec succès"});
            } else {
                return next(new HttpError("Erreur de requête, la mise à jour du post n'a pas été faite", 500));
            }
        });
    } else if (!title || !category || !imageUrl) {
        // Messages d'erreur si un champ n'est pas rempli

        let errorMessages = [];
        let answ;
        answ = !title ? errorMessages.push(" Titre") : "";
        answ = !category ? errorMessages.push(" Catégorie") : "";
        answ = !imageUrl ? errorMessages.push(" Image") : "";

        errorMessages = errorMessages.join();

        return next(new HttpError("Veuillez véfifier les champs suivants :" + errorMessages, 400));
    }

    /*// Requête
    const updatePost = db.query(sql, (error, result) => {
        if (!error) {
            // Supprimer l'image dans le serveur
            fs.unlink(imagePath, (err) => {
                console.log(err);
            });
            res.status(200).json({ message: "Post mis à jour avec succès!" });
        } else {
            return next(new HttpError("Erreur de requête, la publication n'a pas pu être mise à jour", 500));
        }
    });*/
};