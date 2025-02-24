const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://playvalorant.com/fr-fr/news/';
const path = './scraper/liste_rss_scraper.json';

//Charger les articles déjà vus à partir du fichier
function loadSeenArticles() {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, 'utf-8');
        return JSON.parse(data);
    } else {
        console.log("Erreur: liste_rss_scraper.json non trouvé.")
        return {};
    }
}

//Sauvegarder les articles vus dans le fichier
function saveSeenArticles(seenArticles) {
    fs.writeFileSync(path, JSON.stringify(seenArticles, null, 2), 'utf-8');
}

//Fonction pour vérifier si un article est déjà vu
function isArticleSeen(articleLink, game, seenArticles) {
    if (!seenArticles[game]) {
      return false;
    }
  
    const cleanArticleLink = articleLink.trim();
  
    //Vérifier si un article avec le même titre a déjà été vu
    return seenArticles[game].some(seenArticle => seenArticle.trim() === cleanArticleLink);
}

//Fonction pour ajouter un article au jeu correspondant
function addArticleToSeen(articleLink, game, seenArticles) {
    if (!seenArticles[game]) {
      seenArticles[game] = [];
    }

    seenArticles[game].push(articleLink);
    saveSeenArticles(seenArticles);
}

//Fonction pour formater la date en JJ/MM/YYYY
function formatDate(datetime) {
    const date = new Date(datetime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

async function rss_valorant() {
    try {
        const seenArticles = await loadSeenArticles(); //Charger les articles vus
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const articles = [];

        //Sélectionner tous les éléments <a> avec la classe spécifiée
        $('a.action').each((index, element) => {
            const role = $(element).attr('role');
            if (role !== 'button') return;
            
            const href = $(element).attr('href');
            const title = $(element).attr('aria-label');
            const articleUrl = new URL(href, url).href;

            if (!title || !articleUrl) {
                console.log('Titre ou URL non trouvée pour Valorant');
                return;
            }

            //Extraire les détails de l'article
            const date = formatDate($(element).find('time').attr('datetime')) || 'Date non trouvée';
            const type = $(element).find('[data-testid="card-category"]').text() || 'Type non trouvé';
            const description = $(element).find('[data-testid="card-description"]').text() || 'Description non trouvée';

            //Vérifier si l'article a déjà été vu
            if (!isArticleSeen(articleUrl, "valorant", seenArticles)) {
                articles.push({
                    title,
                    articleUrl,
                    date,
                    type,
                    description
                });
                //Sauvegarder les articles vus dans le fichier
                addArticleToSeen(articleUrl, "valorant", seenArticles);
            }
        });
        
        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

module.exports = { rss_valorant };
