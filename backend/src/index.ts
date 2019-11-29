import { restTokenAuth } from "./allegroHandlers/restAuth"
import { createSoapClient, doLoginWithAccessToken } from "./allegroHandlers/soapAuth"
import { getOfferBids, processOfferData } from "./allegroHandlers/offerData"

const app = require('express')()

require('dotenv').config({ path: '.env' })

app.get('/', (req, res) => {
  res.end('hello world!')
})

app.use('/health', require('./routes/health.ts'))

app.use((req, res) => {
  res
    .status(404)
    .json({
      message: 'not found'
    })
})

app.use((err, req, res, next) => {
  let error = {
    status: err.status || 500,
    message: err.message || 'Something went wrong!'
  }
  if (process.env.NODE_ENV === 'development') {
    error['stack'] = err.stack
  }
  res
    .status(err.status || 500)
    .json(error)
})

const port = process.env.PORT || 5000
// app.listen(port, () => console.log(`app backend is running on port ${port}`))

async function test() {
  // const auth = await restTokenAuth()
  // console.log(auth)
  const accessToken = process.env.ALLEGRO_TEMP_TOKEN
  const soapClient = await createSoapClient(accessToken)
  const webApiSession = await doLoginWithAccessToken(soapClient, accessToken)
  const offerId = 8626300812
  // const offerId = 8629469481
  const offerData = await getOfferBids(soapClient, webApiSession.sessionHandlePart, offerId)
  const processedData = processOfferData(offerData)
  const response = {
    timestamp: Date.now(),
    offer: offerId,
    data: processedData
  }
  console.log(response)
}

test()