import { getOfferdata } from "./contentScript/offerData";

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.offerId) {
            const offerData = await getOfferdata(request.offerId)
            sendResponse({ offerData });
        }
    });