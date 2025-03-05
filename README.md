# Bot_Discord_Flux_Rss #

## Start sur serveur O2switch ##
Pour lancer le bot sur un serveur O2switch:
- Aller dans l'environnement virtuelle de l'applicaiton node JS ex:
```bash
source /home/tema0000/nodevenv/discord-bot/22/bin/activate && cd /home/tema0000/discord-bot
```
- Ensuite le lancer en arrière plan ex:
```bash
setsid node index.js > output.log 2>&1 &
```

Pour voir les logs:
```bash 
cat output.log 
``` 

Pour localiser et kill le programe:
```bash 
ps aux | grep node
Kill <ID>
``` 

## Path notes ##
Version actuel: 1.1.6

Patch notes:
1.1.6
Ajouts:
- CI/CD

Fix:
- Eslint auto fix
- Update package

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
- Liste des link des article pour (Valo et R6) format JSON
- Les articles Steam seront en français si disponible

1.0.1
Fix:
- Erreur URL des annonces dans les messages du flux Steam
