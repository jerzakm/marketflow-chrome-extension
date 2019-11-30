import * as express from 'express'
import { getOfferBids, processOfferData } from '../allegroHandlers/offerData'
import { appState } from '..'
import { login } from '../allegroHandlers/soapAuth'

const router = express.Router()

router.get('/:id', async (req, res) => {
  const offerId = req.params.id

  let offerData: any = await getOfferBids(appState.soapClient, 'k', offerId)
  if (offerData.body && offerData.body.includes('ERR_NO_SESSION')) {
    console.log('no session > try again')
    await login()
    offerData = await getOfferBids(appState.soapClient, appState.webapiSession, offerId)
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