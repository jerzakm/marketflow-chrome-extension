export const getOfferBids = (client: any, sessionHandle: string, itemId: number) => {
    return new Promise((resolve, reject) => {
        client.doGetBidItem2({
            sessionHandle, itemId}, function(err, result) {
                resolve(result)
                reject(err)
            });
    });
}

export const processOfferData = (offerData:any) => {
    const processedData: OfferDataEntry[] = []
    if(offerData.biditemList) {
        for(const b of offerData.biditemList.item) {
            const bid = b.bidsArray.item
            const entry:OfferDataEntry = {
                timestamp: bid[7],
                price: bid[6],
                quantity: bid[5]
            }
            processedData.push(entry)
        }
    }
    return processedData
}

interface OfferDataEntry {
    timestamp: number
    price: number
    quantity: number
}