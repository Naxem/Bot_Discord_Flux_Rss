const fs = require('fs');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const path = './rss/steam/liste_rss_steam.json';

// Fonction pour charger les articles déjà vus
function loadSeenArticles() {
  if (fs.existsSync(path)) {
    const seenArticles = fs.readFileSync(path, 'utf-8');
    return JSON.parse(seenArticles);
  } else {
    console.log("Erreur: fichier 'liste_rss_steam.json' non trouvé.");
    return {};
  }
}

// Fonction pour sauvegarder les articles vus dans le fichier JSON
function saveSeenArticles(seenArticles) {
  fs.writeFileSync(path, JSON.stringify(seenArticles, null, 2), 'utf-8');
}

// Fonction pour vérifier si un article est déjà vu
function isArticleSeen(articleUrl, game, seenArticles) {
  // Vérification que le jeu existe et que les articles sont bien enregistrés
  if (!seenArticles[game]) {
    return false;
  }

  // Suppression des espaces supplémentaires autour de l'URL à comparer
  const cleanArticleUrl = articleUrl.trim();

  // Vérification si l'URL de l'article est présente dans la liste des articles vus pour le jeu
  return seenArticles[game].some(seenUrl => seenUrl.trim() === cleanArticleUrl);
}

// Fonction pour ajouter un article au jeu correspondant
function addArticleToSeen(articleUrl, game, seenArticles) {
  if (!seenArticles[game]) {
    seenArticles[game] = [];
  }
  seenArticles[game].push(articleUrl);
  saveSeenArticles(seenArticles);
}

// Fonction pour reformater la date au format DD/MM/YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Fonction pour récupérer et traiter le flux RSS d'un jeu sur Steam
async function rss_steam(url, game) {
  const seenArticles = loadSeenArticles(); // Charger les articles vus

  try {
    const response = await axios.get(url);
    const parser = new XMLParser();
    const rssData = parser.parse(response.data);

    // Récupérer les items du flux
    const items = rssData.rss.channel.item;
    const feedItems = [];

    items.forEach(item => {
      const title = item.title;
      let description = item.description;
  
      // Supprimer toutes les balises HTML tout en conservant le texte
      description = description.replace(/<[^>]*>/g, ''); // Supprime toutes les balises HTML
  
      // Remplacer les balises <br> par des sauts de ligne
      description = description.replace(/<br\s*\/?>/gi, '\n');
  
      // Supprimer les espaces supplémentaires
      description = description.replace(/\s+/g, ' ').trim();
  
      // Limiter la description à 50 caractères
      if (description.length > 50) {
          description = description.substring(0, 200) + "..."; // Ajouter "..." si tronqué
      }
  
      const articleUrl = item.link;
      const date = item.pubDate;
  
      // Vérifier si l'article a déjà été vu
      if (!isArticleSeen(articleUrl, game, seenArticles)) {
          feedItems.push({
              title,
              description,
              articleUrl,
              date: formatDate(date) // Reformater la date
          });
          // Ajouter l'article au fichier JSON
          addArticleToSeen(articleUrl, game, seenArticles);
      }
  });  

    return feedItems;
  } catch (error) {
    console.error(`Erreur lors de la récupération du flux RSS pour ${game}:`, error);
  }
}

module.exports = { rss_steam };
