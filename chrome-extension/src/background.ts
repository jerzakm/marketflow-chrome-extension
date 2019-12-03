import { findOfferId } from "./contentScript/offerData";

chrome.webNavigation.onCommitted.addListener(async function (details) {
    console.log(details)
    const url = JSON.stringify(details.url);
    const offerId = findOfferId(url);
    //
    if (offerId) {
        console.log('found offerid ' + offerId)
        const response = await fetch(`https://j17pxmapkl.execute-api.eu-central-1.amazonaws.com/dev/offerdata/${offerId}`)
        const offerData = await response.json()
        console.log(offerData)
        chrome.storage.local.set({
            [offerId]: offerData
        });
    }
},
    {   //todo find a closer match to trigger the script less, allegro.pl/oferta doesn't apply to all offers
        url: [{ urlMatches: 'https://allegro.pl/*' }]
    }
);