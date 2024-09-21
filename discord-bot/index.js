const { Client, GatewayIntentBits } = require('discord.js');
const { token, guildId, forumChannelId } = require('./token');
const { rss_valorant } = require('./scraper/valorant/scraper_valorant');
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

    //Récupérer le channel par ID
    const forumChannel = guild.channels.cache.get(forumChannelId);
    if (!forumChannel) {
        console.log('Forum non trouvé');
        return;
    }

    //Récupérer le thread dans le forum (s'il s'agit d'un forum)
    const thread = forumChannel.threads.cache.find(thread => thread.name === threadName);

    if (!thread) {
        console.log('Post '+ threadName +' non trouvé dans le forum');
        return;
    }

    //Envoyer un message dans le thread
    try {
        await thread.send(formattedMessage);
        console.log("Message envoyé")
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
    }
}

client.once('ready', async () => {
    console.log('Le bot est prêt !');

    const executeTask = async () => {
        console.log('start rss valorant');
        result_rss = await rss_valorant();
        console.log(result_rss);
        for (let i = result_rss.length - 1; i >= 0; i--) {
            const article = result_rss[i];
            const formattedMessage = `
            **${article.title}**\n
            [Lire l'article ici](<${article.articleUrl}>)
            *Publié le :* ${article.date}
            # ${article.type} #
            ${article.description}
            `;
            send_message("Valorant", formattedMessage);
        };
    }

    executeTask();

    //Planifie une tâche quotidienne à minuit
    cron.schedule('0 14 * * 1-5', () => {
        console.log('Cron exécutée à 14h !');
        executeTask();
    });   
});

client.login(token);
