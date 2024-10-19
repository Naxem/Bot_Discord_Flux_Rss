const { Client, GatewayIntentBits } = require('discord.js');
const { token, guildId, forumChannelId } = require('./token');
const fs = require('fs');
const { rss_valorant } = require('./scraper/valorant/scraper_valorant');
const { rss_r6 } = require('./scraper/r6/scraper_r6');
const { rss_steam } = require('./rss/steam/rss_steam');
const path = './rss/steam/liste_lien_jeux.json';
const cron = require('node-cron');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

//Obtenir la date et l'heure actuelles
function date_actuelle() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); //Jour sur 2 chiffres
    const month = String(date.getMonth() + 1).padStart(2, '0'); //Mois sur 2 chiffres
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0'); //Heures sur 2 chiffres
    const minutes = String(date.getMinutes()).padStart(2, '0'); //Minutes sur 2 chiffres
    const seconds = String(date.getSeconds()).padStart(2, '0'); //Secondes sur 2 chiffres
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
}

async function send_message(threadName, formattedMessage, embed) {   
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
        console.log(date_actuelle() + ': Serveur non trouvé');
        return;
    }

    const forumChannel = guild.channels.cache.get(forumChannelId);
    if (!forumChannel) {
        console.log(date_actuelle() + ': Forum non trouvé');
        return;
    }

    //Vérifie dans les threads actifs
    let thread = forumChannel.threads.cache.find(thread => thread.name === threadName);

    //Si le thread n'est pas trouvé, on cherche dans les threads archivés
    if (!thread) {
        try {
            //Récupère les threads archivés
            const archivedThreads = await forumChannel.threads.fetchArchived({ fetchAll: true });
            thread = archivedThreads.threads.find(thread => thread.name === threadName);

            if (thread && thread.archived && !thread.locked) {
                //Désarchiver le thread s'il est trouvé et pas verrouillé
                await thread.setArchived(false);
                console.log(date_actuelle() + ": Le thread " + threadName + " a été désarchivé.");
            }
        } catch (error) {
            console.error(date_actuelle() + ': Erreur lors de la récupération des threads archivés :', error);
            return;
        }
    }

    if (!thread) {
        console.log(date_actuelle() + ': Post '+ threadName +' non trouvé dans le forum');
        return;
    }

    try {
        //Envoie le message
        if (formattedMessage) {
            await thread.send(formattedMessage);
        } else {
            await thread.send({ embeds: [embed] });
        }
        console.log(date_actuelle() + ": Message envoyé pour " + threadName);
    } catch (error) {
        console.error(date_actuelle() + ': Erreur lors de l\'envoi du message :', error);
    }
}

client.once('ready', async () => {
    console.log(date_actuelle() + ': Le bot est prêt !');

    const executeTask = async () => {
        console.log(date_actuelle() + ': Start rss Valorant');
        const result_rss_valorant = await rss_valorant();
        if (result_rss_valorant && result_rss_valorant.length > 0) {
            for (let i = result_rss_valorant.length - 1; i >= 0; i--) {
                const article = result_rss_valorant[i];
                const formattedMessage = `
                **${article.title}**
                [Lire l'article ici](<${article.articleUrl}>)
                *Publié le :* ${article.date}
                # ${article.type} #
                ${article.description}\n
                -------------------------------------------------------
                `;
                await send_message("Valorant", formattedMessage, false);
            }
        } else {
            console.log(date_actuelle() + `: Aucun nouvel article pour Valorant`);
        }

        console.log(date_actuelle() + ': Start rss Rainbow six siège');
        const result_rss_r6 = await rss_r6();
        if (result_rss_r6 && result_rss_r6.length > 0) {
            for (let i = result_rss_r6.length - 1; i >= 0; i--) {
                const article = result_rss_r6[i];
                const embed = {
                    title: article.title,
                    url: article.articleUrl, //Lien de l'article si on clique sur le titre
                    description: `*Publié le :* ${article.date}\n${article.description}`,
                    image: {
                        url: article.imageUrl,
                    },
                };
                await send_message("Rainbow six siège", false, embed);
            }
        } else {
            console.log(date_actuelle() + `: Aucun nouvel article pour Rainbow six siège`);
        }

        console.log(date_actuelle() + ': Start rss jeux Steam');
        const list_links_game = fs.readFileSync(path, 'utf-8');
        const list_link = JSON.parse(list_links_game);

        for (const [game_name, rss_url] of Object.entries(list_link)) {
            try {
                const result_rss_steam = await rss_steam(rss_url, game_name);

                if (result_rss_steam && result_rss_steam.length > 0) {
                    for (let i = result_rss_steam.length - 1; i >= 0; i--) {
                        const article = result_rss_steam[i];
                        const formattedMessage = `
                        **${article.title}**
                        [Lire l'article ici](<${article.link}>)
                        *Publié le :* ${article.date}
                        ${article.description}\n
                        -------------------------------------------------------
                        `;
                        await send_message(game_name, formattedMessage, false);
                    }
                } else {
                    console.log(date_actuelle() + `: Aucun nouvel article pour ${game_name}`);
                }
            } catch (error) {
                console.error(date_actuelle() + `: Erreur lors de la récupération du flux RSS pour ${game_name}:`, error);
            }
        }
    }

    await executeTask();

    // Lundi à vendredi à 10h, 14h et 18h
    cron.schedule('0 10,14,18 * * 1-5', () => {
        console.log('Cron exécutée à 10h, 14h ou 18h en semaine !');
        executeTask();
    });

    // Week-end à 18h
    cron.schedule('0 18 * * 6,0', () => {
        console.log('Cron exécutée à 18h le week-end !');
        executeTask();
    });
});

client.login(token);