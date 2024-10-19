## Bot_Discord_Flux_Rss ##

# Start local #
Pour lancer le bot en local: node index.js

# Start serveur O2switch #
Pour lancer le bot sur ce serveur il faut:
- Aller dans l'environnement virtuelle de l'applicaiton node JS (ex: source /home/tema4598/nodevenv/discord/20/bin/activate && cd /home/tema4598/discord)
- ensuite le lancer en arrière plan: setsid node index.js > output.log 2>&1 &

Pour voir les logs cat output.log
Pour kill de programe: 'ps aux | grep node' pour localiser le programe et 'Kill <ID>'

Version actuel: 1.1.0

Patch notes:
1.1.0
Ajout: 
-Flux rss pour le jeu Rainbow six siège (r6)

Modification: 
-Cron ajouter pour le week-end à 18h
-Augmentation du nombre de caractère dans la description (rss steam)
-Ajout de la date et l'heure dans les logs
-Liste des link des article dans scrpaer (valo et r6) mmaintennat c'est un json
-les articles steam seront en français si disponible

1.0.1
Fix: 
-Erreur url des annonces dans les messages du flux steam