import * as express from 'express'
import { getOfferBids, processOfferData } from '../allegroHandlers/offerData'
import { appState } from '..'

const router = express.Router()

router.get('/:id', async (req, res) => {
  const offerId = req.params.id

  const offerData: any = await getOfferBids(appState.soapClient, appState.webapiSession, offerId)
  if (offerData.body && offerData.body.includes('ERR_NO_SESSION')) {
    console.log('no session > try again')
  }
  const processedData = processOfferData(offerData)
  const response = {
    timestamp: Date.now(),
    offer: offerId,
    data: processedData
  }

  res.json(response)
})

module.exports = router