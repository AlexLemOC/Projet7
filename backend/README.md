Projet Groupomania (P7 - OC)

// Base de donnée SQL
// Principe de réseau social professionnel
// Session maintenue avec un utilisateur et son token
// Mot de passe crypté (bcrypt)

npm install sur le backend contient bcrypt || body-parser || express || express-rate-limit || helmet || jsonwebtoken || multer || mysql ||secure-password-validator || validator

le frontend contient tous les modules React

le .env doit être modifié pour contenir votre host et le nom de la base de donnée à créer ainsi que votre user root et votre mot de passe serv mysql 
Si un problème est survenu, le fichier .sql est présent dans le dossier backend et pourra être injecté manuellement sur votre mysql

Terminal 1 : 
cd backend
npm install
node config_db.js
nodemon server

Terminal 2 : 
cd frontend
npm install
npm start

Le site sera sur le localhost:4200
ctrl+c pour terminer le terminal