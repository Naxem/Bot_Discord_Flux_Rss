const fs = require('fs');
const path = './seenArticles.json';

//Fonction pour charger les articles déjà vus
function loadSeenArticles() {
  if (fs.existsSync(path)) {
    const seenArticles = fs.readFileSync(path, 'utf-8');
    return JSON.parse(seenArticles);
  } else {
    console.log("Error fichier seenArticles.json")
    return
  }
}

//Fonction pour sauvegarder les articles vus dans le fichier JSON
function saveSeenArticles(seenArticles) {
  fs.writeFileSync(path, JSON.stringify(seenArticles, null, 2), 'utf-8');
}

//Fonction pour vérifier si un article est déjà vu
function isArticleSeen(articleUrl, game, seenArticles) {
  return seenArticles[game] && seenArticles[game].includes(articleUrl);
}

//Fonction pour ajouter un article au jeu correspondant
function addArticleToSeen(articleUrl, game, seenArticles) {
  if (!seenArticles[game]) {
    seenArticles[game] = [];
  }
  seenArticles[game].push(articleUrl);
  saveSeenArticles(seenArticles);
}

async function rss_steam(url, game) {
  //Charger les articles vus
  const seenArticles = loadSeenArticles();

  try {
    const response = await fetch(url);
    const rssText = await response.text();
    
    //Parser le flux RSS
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rssText, "application/xml");

    //Récupérer les items du flux
    const items = xmlDoc.querySelectorAll('item');
    const feedItems = [];

    items.forEach(item => {
      const title = item.querySelector("title")?.textContent;
      const description = item.querySelector("description")?.textContent;
      const articleUrl = item.querySelector("link")?.textContent;
      const date = item.querySelector("pubDate")?.textContent;

      //Vérifier si l'article a déjà été vu
      if (!isArticleSeen(articleUrl, game, seenArticles)) {
        feedItems.push({
          title,
          description,
          articleUrl,
          date
        });
        //Ajouter l'article au fichier JSON
        addArticleToSeen(articleUrl, game, seenArticles);
      }
    });
    return feedItems;
  } catch (error) {
    console.error("Erreur lors de la récupération du flux RSS:", error);
  }
}

module.exports = { rss_steam };
