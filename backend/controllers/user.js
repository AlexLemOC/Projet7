"use strict";

// Middleware Imports
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const fs = require("fs");
const validator = require("validator");
const passValid = require("secure-password-validator");

// Error Class
const HttpError = require("../models/http-error");

// Database Route
const db = require("../config/db");

// Password Validator Options
const options = {
    // min 8 caractères
    minLength: 8,
    // max 50 caractères
    maxLength: 50,
    // doit contenir des chiffres
    digits: true,
    // doit contenir des lettres
    letters: true,
    // doit avoir une Majuscule
    uppercase: true,
    // doit avoir une minuscule
    lowercase: true,
    // ne doit pas contenir de symbole
    symbols: false,
};

// RegEX Text
const regExText = /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ '\-]+$/i;

// UserID decoder
const decodeUid = (authorization) => {
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return {
        id: decodedToken.userId,
        clearance: decodedToken.account,
    };
};

// GET User Profile Controller
//==========================================================================================================
exports.getUserProfile = (req, res, next) => {
    const { id } = req.params;

    const string =
        "SELECT firstName, lastName, email, photo_url, department, role, linkedin_url FROM users WHERE id = ?";
    const inserts = [id];
    const sql = mysql.format(string, inserts);

    const query = db.query(sql, (error, profile) => {
        if (!error) {
            res.status(200).json(profile[0]);
        } else {
            return next(new HttpError("Utilisateur non trouvé", 404));
        }
    });
};

// PATCH User Profile Update Controller
//==========================================================================================================
exports.updateUserProfile = (req, res, next) => {
    const user = decodeUid(req.headers.authorization);
    const { firstName, lastName, email, department, role, linkedin_url } = req.body;

    let imageUrl;

    if (req.body.image === "null") {
        // màj des données sans l'image
        imageUrl;
    } else if (req.file) {
        // màj données + image
        imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    } else {
        // màj données, image déjà présente
        imageUrl = req.body.image;
    }

    // Validation des donnés
    let isFirstName = validator.matches(firstName, regExText);
    let isLastName = validator.matches(lastName, regExText);
    let isEmail = validator.isEmail(email);

    let isDepartment = true;
    let isRole = true;
    let isLinkedinUrl = true;

    if (req.body.department) {
        isDepartment = validator.matches(String(department), regExText);
    }
    if (req.body.role) {
        isRole = validator.matches(String(role), regExText);
    }
    if (req.body.linkedin_url) {
        isLinkedinUrl = validator.isURL(String(linkedin_url), [["http", "https"]]);
    }

    if (isFirstName && isLastName && isEmail && isDepartment && isRole && isLinkedinUrl) {
        const string =
            "UPDATE users SET firstName = ?, lastName = ?, email = ?, photo_url = ?,  department = ?, role = ?, linkedin_url = ? WHERE id = ?";
        const inserts = [firstName, lastName, email, imageUrl, department, role, linkedin_url, user.id];
        const sql = mysql.format(string, inserts);

        // Requête
        const query = db.query(sql, (error, profile) => {
            if (!error) {
                res.status(200).json({ message: "Mise à jour effectuée avec succès!" });
            } else {
                return next(new HttpError("Erreur de requête, la mise à jour du profil n'a pas été faite", 500));
            }
        });
    } else if (!isFirstName || !isLastName || !isEmail || !isDepartment || !isRole || !isLinkedinUrl) {
        // Error Handling pour afficher les messages d'erreur

        let errorMessages = [];
        let answ;
        answ = !isFirstName ? errorMessages.push(" Prénom") : "";
        answ = !isLastName ? errorMessages.push(" Nom") : "";
        answ = !isEmail ? errorMessages.push(" E-mail") : "";
        answ = !isDepartment ? errorMessages.push(" Departement") : "";
        answ = !isRole ? errorMessages.push(" Poste") : "";
        answ = !isLinkedinUrl ? errorMessages.push(" LinkedIn") : "";

        errorMessages = errorMessages.join();

        return next(new HttpError("Veuillez vérifier les champs suivants :" + errorMessages, 400));
    }
};

// PUT Update User Password Controller
//==========================================================================================================
exports.updatePassword = (req, res, next) => {
    const user = decodeUid(req.headers.authorization);
    const { password } = req.body;

    // Vérification du mot de passe
    if (passValid.validate(password, options).valid) {
        // Hash du nouveau mot de passe
        bcrypt.hash(req.body.password, 10).then((hash) => {
            const string = "UPDATE users SET password = ? WHERE id = ? ";
            const inserts = [hash, user.id];
            const sql = mysql.format(string, inserts);

            // Requête
            const query = db.query(sql, (error, password) => {
                if (!error) {
                    res.status(201).json({ message: "Mot de passe mis à jour avec succès!" });
                } else {
                    return next(
                        new HttpError("Erreur de requête, la mise àjour du mot de passe n'a pas été faite", 500)
                    );
                }
            });
        });
    } else {
        return next(new HttpError("Votre mot de passe n'est pas valide", 401));
    }
};

// DELETE User Controller
//==========================================================================================================
exports.deleteProfile = (req, res, next) => {
    const user = decodeUid(req.headers.authorization);

    // Vérification si c'est le même utilisateur qui fait la demande
    if (user.id === Number(req.params.id)) {
        const string = "DELETE FROM users WHERE id = ? ";
        const inserts = [user.id];
        const sql = mysql.format(string, inserts);

        // Requête
        const query = db.query(sql, (error, result) => {
            if (!error) {
                res.status(200).json({ message: "User supprimé avec succès!" });
            } else {
                return next(new HttpError("Erreur de requête, l'utilisateur/trice n'a pas été supprimé(e)", 500));
            }
        });
    } else {
        res.status(401).json({ message: "Non Autorisé !" });
    }
};