## Bot_Discord_Flux_Rss ##

# Start local #
Pour lancer le bot en local: node index.js

# Start sur serveur O2switch #
Pour lancer le bot sur ce serveur il faut:
- Aller dans l'environnement virtuelle de l'applicaiton node JS (ex: source /home/tema4598/nodevenv/discord/20/bin/activate && cd /home/tema4598/discord)
- ensuite le lancer en arrière plan: setsid node index.js > output.log 2>&1 &

Pour voir les logs cat output.log
Pour kill de programe: 'ps aux | grep node' pour localiser le programe et 'Kill <ID>'

Version actuel: 1.1.5

Patch notes:
1.1.5
Fix:
- Fix envoi message Valorant

1.1.4
Fix:
- Fix erreur lors de la lecture des flux rss steam quand la description d'un article n'est pas disponible
- Fix l'envoi des nouveaux messages pour valorant 

1.1.3
Ajouts:
- RSS jeux Overwatch

1.1.2
Modifications:
- Changement du cron

Ajouts:
- Ajout d'un try catch pour récup les erreurs

1.1.1
Modifications:
- Changement des messages pour Valorant et Steam

Ajouts:
- RSS Steam Call of duty (Games dans le CodQG)

1.1.0
Ajouts:
- Flux RSS pour le jeu Rainbow six siège (R6)

Modifications:
- Cron ajouter pour le week-end à 18h
- Augmentation du nombre de caractère dans la description (RSS Steam)
- Ajout de la date et l'heure dans les logs
- Liste des link des article dans scrpaer (Valo et R6) mmaintenant c'est un json
- Les articles Steam seront en français si disponible

1.0.1
Fix:
- Erreur URL des annonces dans les messages du flux Steam
