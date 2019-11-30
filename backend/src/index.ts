import { createSoapClient, doLoginWithAccessToken, login } from "./allegroHandlers/soapAuth"
import { getOfferBids, processOfferData } from "./allegroHandlers/offerData"

const app = require('express')()

require('dotenv').config({ path: '.env' })

app.get('/', (req, res) => {
  res.end('hello world!')
})

app.use('/health', require('./routes/health.ts'))
app.use('/offerdata', require('./routes/offerData.ts'))

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

export const appState = {
  webapiSession: '',
  offerData: [],
  soapClient: undefined
}

const startup = async () => {
  appState.soapClient = await createSoapClient()
  await login()
  app.listen(port, () => console.log(`app backend is running on port ${port}`))
}

async function test() {
  appState.soapClient = await createSoapClient()
  await login()
  const offerId = 8626300812
  // const offerId = 8629469481
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
  console.log(response)
}

// test()
startup()