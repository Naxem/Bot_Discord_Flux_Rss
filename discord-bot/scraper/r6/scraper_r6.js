const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://www.ubisoft.com/fr-fr/game/rainbow-six/siege/news-updates";
const path = "./scraper/liste_rss_scraper.json";

//Charger les articles déjà vus à partir du fichier
function loadSeenArticles() {
  if (fs.existsSync(path)) {
    const data = fs.readFileSync(path, "utf-8");
    return JSON.parse(data);
  } else {
    console.log("Erreur: liste_rss_scraper.json non trouvé.");
    return {};
  }
}

//Sauvegarder les articles vus dans le fichier
function saveSeenArticles(seenArticles) {
  fs.writeFileSync(path, JSON.stringify(seenArticles, null, 2), "utf-8");
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
function formatDate(day, month, year) {
  const formattedDay = String(day).padStart(2, "0");  // Ajoute un 0 si nécessaire
  const formattedMonth = String(month).padStart(2, "0");  // Ajoute un 0 si nécessaire
  return `${formattedDay}/${formattedMonth}/${year}`;
}

async function rss_r6() {
  try {
    const seenArticles = await loadSeenArticles(); //Charger les articles vus
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const articles = [];

    //Sélectionner tous les éléments <a> avec la classe spécifiée
    $("a.updatesFeed__item").each((index, element) => {
      const href = $(element).attr("href");
      const articleUrl = new URL(href, url).href;

      //Extraire les détails de l'article
      const title = $(element).find("h2").text() || "Titre non trouvé";

      //Récupérer la date en format JJ/MM/YYYY
      const day = $(element).find(".date__day").text();
      const month = $(element).find(".date__month").text();
      const year = $(element).find(".date__year").text();
      const date = formatDate(day, month, year);

      const imageUrl = $(element).find("img").attr("src") || "Image non trouvée";
      const description = $(element).find("p").text() || "Description non trouvée";

      //Vérifier si l'article a déjà été vu
      if (!isArticleSeen(articleUrl, "r6", seenArticles)) {
        articles.push({
          title,
          articleUrl,
          date,
          imageUrl,
          description
        });
        //Sauvegarder les articles vus dans le fichier
        addArticleToSeen(articleUrl, "r6", seenArticles);
      }
    });

    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
}

module.exports = { rss_r6 };
