
// URL du flux RSS
const rssUrl = 'https://steamcommunity.com/games/2139460/rss';
fetchRSSFeed(rssUrl);

async function rss_once_human(url) {
    try {
        const response = await fetch(url);
        const rssText = await response.text();
        
        //Parser le flux RSS
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssText, "application/xml");
    
        //Récupérer les items du flux
        const items = xmlDoc.querySelectorAll("item");
        const feedItems = [];
    
        items.forEach(item => {
          const title = item.querySelector("title")?.textContent;
          const description = item.querySelector("description")?.textContent;
          const articleUrl = item.querySelector("link")?.textContent;
          const date = item.querySelector("pubDate")?.textContent;
    
          feedItems.push({
            title,
            description,
            articleUrl,
            date
          });
        });
    
        return feedItems;
      } catch (error) {
        console.error("Erreur lors de la récupération du flux RSS:", error);
      }
}

async function rss_payday3(url) {
  try {
      const response = await fetch(url);
      const rssText = await response.text();
      
      //Parser le flux RSS
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(rssText, "application/xml");
  
      //Récupérer les items du flux
      const items = xmlDoc.querySelectorAll("item");
      const feedItems = [];
  
      items.forEach(item => {
        const title = item.querySelector("title")?.textContent;
        const description = item.querySelector("description")?.textContent;
        const articleUrl = item.querySelector("link")?.textContent;
        const date = item.querySelector("pubDate")?.textContent;
  
        feedItems.push({
          title,
          description,
          articleUrl,
          date
        });
      });
  
      return feedItems;
    } catch (error) {
      console.error("Erreur lors de la récupération du flux RSS:", error);
    }
}

module.exports = { rss_once_human, rss_payday3 };