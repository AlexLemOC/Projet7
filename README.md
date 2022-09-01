# Projet7
### Groupomania est un réseau social professionnel créé pour faciliter les interractions entre collègues. Le site permet donc la création, la lecture, la modification et la suppression de posts contenant un texte et une image. Il y a des membres normaux (users) et des admins pouvant modifier et supprimer n'importe quel post.

# Installation de l'application Groupomania
### Ouvrir 2 terminaux

## Pour la partie Backend : 
- se mettre au niveau de `/backend` dans un terminal et faire `npm install`
- modifier dans `.env` le host et le mdp pour que cela corresponde à votre MySQL
- faire `node config_db.js` pour lancer le programme de configuration de la base de donnée SQL
- insérer le dump `groupomaniaDB.sql` dans votre base de donnée fraîchement créée dans MySql pour avoir les feeds et les profiles.
- il n'y a plus qu'a écrire dans le terminal `nodemon start` pour lancer la connexion à la base de donnée de MySQL

## Pour la partie Frontend :
- se mettre au niveau de `/frontend` dans le deuxième terminal et faire `npm install`
- faire `npm start` pour lancer l'application qui ouvrira automatiquement une page internet avec le site groupomania

#### Pour l'évaluation, l'admin sera envoyé en fichier .txt sinon il faut changer le tableau dans users account pour passer de user à admin.
