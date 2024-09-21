const { Client, GatewayIntentBits } = require('discord.js');
const { token, guildId, forumChannelId } = require('./token');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once('ready', async () => {
    console.log('Le bot est prêt !');

    const threadName = 'test';

    const guild = await client.guilds.fetch(guildId);
    
    if (!guild) {
        console.log('Serveur non trouvé');
        return;
    }

    // Récupérer le channel par ID
    const forumChannel = guild.channels.cache.get(forumChannelId);

    if (!forumChannel) {
        console.log('Forum non trouvé');
        return;
    }

    // Affiche le type du channel
    console.log(`Type du channel : ${forumChannel.type}`);

    // Récupérer le thread dans le forum (s'il s'agit d'un forum)
    const thread = forumChannel.threads.cache.find(thread => 
        thread.name === threadName
    );

    if (!thread) {
        console.log('Post "test" non trouvé dans le forum');
        return;
    }

    // Envoyer un message dans le thread
    try {
        await thread.send('Ceci est un message automatique du bot dans le post "test".');
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
    }
});

client.login(token);
