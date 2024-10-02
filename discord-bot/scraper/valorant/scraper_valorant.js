const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://playvalorant.com/fr-fr/news/';
const seenArticlesFile = './scraper/valorant/seenArticles.json';

//Charger les articles déjà vus à partir du fichier
function loadSeenArticles() {
    if (fs.existsSync(seenArticlesFile)) {
        const data = fs.readFileSync(seenArticlesFile);
        return new Set(JSON.parse(data));
    }
    return new Set();
}

//Sauvegarder les articles vus dans le fichier
function saveSeenArticles(seenArticles) {
    fs.writeFileSync(seenArticlesFile, JSON.stringify([...seenArticles]));
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
        const $ = await cheerio.load(data);
        const articles = [];

        //Sélectionner tous les éléments <a> avec la classe spécifiée
        $('a.sc-7fa1932-0').each((index, element) => {
            const href = $(element).attr('href');
            const title = $(element).attr('aria-label');
            const articleUrl = new URL(href, url).href;

            //Vérifier si l'article a déjà été vu
            if (seenArticles.has(articleUrl)) {
                return;
            }
            seenArticles.add(articleUrl); //Ajouter l'article à l'ensemble

            //Extraire les détails de l'article
            const date = formatDate($(element).find('time').attr('datetime')) || 'Date non trouvée';
            const type = $(element).find('[data-testid="card-category"]').text() || 'Type non trouvé';
            const description = $(element).find('[data-testid="card-description"]').text() || 'Description non trouvée';

            articles.push({
                title,
                articleUrl,
                date,
                type,
                description
            });
        });

        //Sauvegarder les articles vus dans le fichier
        await saveSeenArticles(seenArticles);
        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

module.exports = { rss_valorant };
