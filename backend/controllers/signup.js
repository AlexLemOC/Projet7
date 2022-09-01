"use strict";

// Middlewares
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const validator = require("validator");
const passValid = require("secure-password-validator");

// Erreurs Http
const HttpError = require("../models/http-error");

// Route vers la DB
const db = require("../config/db");

// Options de validation du mot de passe
const options = {
    // min 8 caractères
    minLength: 8,
    // max 50 caractères
    maxLength: 50,
    // Doit contenir des chiffres
    digits: true,
    // Doit contenir des lettres
    letters: true,
    // Doit contenir une majuscule
    uppercase: true,
    // Doit contenir une minuscule
    lowercase: true,
    // Ne doit pas contenir de symboles
    symbols: false,
};

// POST Create User Controller
exports.signup = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    // RegEx Text
    const regExText = /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ \'\- ]+$/i;

    // Validation des données de l'utilisateur
    let isFirstName = validator.matches(String(firstName), regExText);
    let isLastName = validator.matches(String(lastName), regExText);
    let isEmail = validator.isEmail(String(email));
    let isPassword = passValid.validate(String(password), options).valid;

    if (isFirstName && isLastName && isEmail && isPassword) {
        // Hash du mot de passe de l'utilisateur
        bcrypt.hash(password, 10, (error, hash) => {
            // Enregistrement des données de l'utilisateur sur la BD MySQL
            const string = "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
            const inserts = [firstName, lastName, email, hash];
            const sql = mysql.format(string, inserts);

            const signupUser = db.query(sql, (error, user) => {
                if (!error) {
                    // Donne un id à l'utilisateur et retourne un Token
                    res.status(201).json({
                        message: "Utilisateur créé correctement",
                        userId: user.insertId,
                        account: "user",
                        token: jwt.sign(
                            {
                                userId: user.insertId,
                                account: "user",
                            },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: process.env.JWT_EXPIRES,
                            }
                        ),
                    });
                } else {
                    return next(new HttpError("Utilisateur déjà existant", 400));
                }
            });
        });
    } else if (!isFirstName || !isLastName || !isEmail || !isPassword) {
        // Error Handling pour les messages d'erreurs à afficher
        let errorMessages = [];

        let anws = !isFirstName ? errorMessages.push(" Prénom") : "";
        anws = !isLastName ? errorMessages.push(" Nom") : "";
        anws = !isEmail ? errorMessages.push(" E-mail") : "";
        anws = !isPassword ? errorMessages.push(" Mot de passe") : "";
        errorMessages = errorMessages.join();

        return next(new HttpError("Veuillez vérifier les champs suivants :" + errorMessages, 400));
    }
};