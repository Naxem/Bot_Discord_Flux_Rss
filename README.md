## Bot_Discord_Flux_Rss ##

# Start local #
Pour lancer le bot en local: node index.js

# Start serveur O2switch #
Pour lancer le bot sur ce serveur il faut:
- Aller dans l'environnement virtuelle de l'applicaiton node JS (ex: source /home/tema4598/nodevenv/discord/20/bin/activate && cd /home/tema4598/discord)
- ensuite le lancer en arrière plan: setsid node index.js > output.log 2>&1 &

Pour voir les logs cat output.log
Pour kill de programe: 'ps aux | grep node' pour localiser le programe et 'Kill <ID>'

Version actuel: 1.0.1

Patch notes:
1.0.1
Fix: erreur url des annonces dans les messages du flux steam

1.0.2
Modification: cron ajouter pour le week-end à 18h
Modification: augmentation du nombre de caractère dans la description (rss steam)
Modification: ajout de la date et l'heure dans les logs