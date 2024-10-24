let description = '<div onclick="javascript:ReplaceWithYouTubeEmbed( this );" data-youtube="gDo86pvhXZU" class="sharedFilePreviewYouTubeVideo sizeFull"><img class="sharedFilePreviewYouTubeVideo sizeFull" src="https://steamcommunity.com/public/shared/images/responsive/youtube_16x9_placeholder.gif"/><iframe src="https://www.youtube.com/embed/gDo86pvhXZU?fs=1&modestbranding=1&rel=0" allowFullScreen="1" frameBorder="0"></iframe></div><br><br>Prepare to pack your bags! We’re going on a trip to Cities Around the World!<br><br>We are happy to announce that the Region Packs will finally be available on Paradox Mods, all 100% free!<br><br>Starting next week with the French Pack, we kick off your exploration of iconic architecture with a pack inspired by Paris. It features different zone types and iconic signature and service buildings.<br><br>On the 11th of November, we will head to Germany to pack the German pack. Will we experience October Fest and eat schnitzel? Not sure, but the pack will allow you to build German-inspired neighborhoods that will make you feel like you can!<br><br>The next stop on the 25th of November will be the iconic UK Pack, with sprawling Low-density row houses and epic estates. We’ve heard that this is the ideal pack to pair with some tea and a copious amount of roundabouts.<br><br>The rest of our Cities Around the World trip has not been booked, but we will keep you updated when this changes!<br><br>We also have many cool giveaways that will happen during the event: <a class="bb_link" href="https://steamcommunity.com/linkfilter/?u=https%3A%2F%2Fpdxint.at%2F3BKQvAl" target="_blank" rel=" noopener" >https://pdxint.at/3BKQvAl</a><br><br></br>'



//Nettoyage de la description
description = description.replace(/<[^>]*>/g, ''); //Supprime les balises HTML
description = description.replace(/<br\s*\/?>/gi, '\n'); //Remplace les <br> par des sauts de ligne
description = description.replace(/\s+/g, ' ').trim(); //Supprime les espaces inutiles
// Tronque la description si elle dépasse 400 caractères
if (description.length > 200) {
  description = description.substring(0, 200) + "..."; 
}

console.log(description)