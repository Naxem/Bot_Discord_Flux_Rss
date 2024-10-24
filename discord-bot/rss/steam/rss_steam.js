const fs = require('fs');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const path = './rss/steam/liste_rss_steam.json';

//Fonction pour charger les articles déjà vus
function loadSeenArticles() {
  if (fs.existsSync(path)) {
    const seenArticles = fs.readFileSync(path, 'utf-8');
    return JSON.parse(seenArticles);
  } else {
    console.log("Erreur: fichier 'liste_rss_steam.json' non trouvé.");
    return {};
  }
}

//Fonction pour sauvegarder les articles vus dans le fichier JSON
function saveSeenArticles(seenArticles) {
  fs.writeFileSync(path, JSON.stringify(seenArticles, null, 2), 'utf-8');
}

//Fonction pour vérifier si un article est déjà vu (basé sur le titre)
function isArticleSeen(articleTitle, game, seenArticles) {
  if (!seenArticles[game]) {
    return false;
  }

  const cleanArticleTitle = articleTitle.trim();

  //Vérifier si un article avec le même titre a déjà été vu
  return seenArticles[game].some(seenArticle => seenArticle.trim() === cleanArticleTitle);
}

//Fonction pour ajouter un article au jeu correspondant (basé sur le titre)
function addArticleToSeen(articleTitle, game, seenArticles) {
  if (!seenArticles[game]) {
    seenArticles[game] = [];
  }

  seenArticles[game].push(articleTitle);
  saveSeenArticles(seenArticles);
}

//Fonction pour reformater la date au format DD/MM/YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

//Fonction pour récupérer et traiter le flux RSS d'un jeu sur Steam
async function rss_steam(url, game) {
  const seenArticles = loadSeenArticles(); //Charger les articles vus

  try {
    const response = await axios.get(url, {
      headers: {
        'Accept-Language': 'fr'
      }
    });

    const parser = new XMLParser();
    const rssData = parser.parse(response.data);
    const items = rssData.rss.channel.item;
    const feedItems = [];

    items.forEach(item => {
      const title = item.title;
      let description = item.description;

      //Nettoyage de la description
      description = description.replace(/<[^>]*>/g, ''); //Supprime les balises HTML
      description = description.replace(/<br\s*\/?>/gi, '\n'); //Remplace les <br> par des sauts de ligne
      description = description.replace(/\s+/g, ' ').trim(); //Supprime les espaces inutiles
      // Tronque la description si elle dépasse 200 caractères
      if (description.length > 200) {
        description = description.substring(0, 200) + "..."; 
      }

      const date = item.pubDate;
      const link = item.link;

      //Vérifier si l'article a déjà été vu (titre uniquement)
      if (!isArticleSeen(title, game, seenArticles)) {
        feedItems.push({
          title,
          description,
          date: formatDate(date),
          link
        });
        //Ajouter l'article au fichier JSON (titre uniquement)
        addArticleToSeen(title, game, seenArticles);
      }
    });

    return feedItems;
  } catch (error) {
    console.error(`Erreur lors de la récupération du flux RSS pour ${game}:`, error);
  }
}

module.exports = { rss_steam };
