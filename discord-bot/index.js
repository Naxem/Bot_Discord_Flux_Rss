const { Client, GatewayIntentBits } = require('discord.js');
const { token, guildId, forumChannelId } = require('./token');
const fs = require('fs');
const { rss_valorant } = require('./scraper/valorant/scraper_valorant');
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

async function send_message(threadName, formattedMessage) {   
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
        console.log('Serveur non trouvé');
        return;
    }

    const forumChannel = guild.channels.cache.get(forumChannelId);
    if (!forumChannel) {
        console.log('Forum non trouvé');
        return;
    }

    const thread = forumChannel.threads.cache.find(thread => thread.name === threadName);

    if (!thread) {
        console.log('Post '+ threadName +' non trouvé dans le forum');
        return;
    }

    try {
        await thread.send(formattedMessage);
        console.log("Message envoyé");
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
    }
}

client.once('ready', async () => {
    console.log('Le bot est prêt !');

    const executeTask = async () => {
        console.log('start rss Valorant');
        const result_rss_valorant = await rss_valorant();
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
            //await send_message("Valorant", formattedMessage);
        }

        console.log('start rss Steam games');
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
                        [Lire l'article ici](${article.articleUrl})
                        *Publié le :* ${article.date}
                        ${article.description}\n
                        `;
                        await send_message(game_name, formattedMessage);
                    }
                } else {
                    console.log(`Aucun nouvel article pour ${game_name}`);
                }
            } catch (error) {
                console.error(`Erreur lors de la récupération du flux RSS pour ${game_name}:`, error);
            }
        }
    }

    await executeTask();

    cron.schedule('0 14 * * 1-5', async () => {
        console.log('Cron exécutée à 14h !');
        await executeTask();
    });   
});

client.login(token);