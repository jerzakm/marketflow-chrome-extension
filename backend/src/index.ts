import { createSoapClient, doLoginWithAccessToken, login } from "./allegroHandlers/soapAuth"
import { getOfferBids, processOfferData } from "./allegroHandlers/offerData"
import * as https from 'https'
import * as fs from 'fs'
import * as bodyParser from 'body-parser'
import { IAllegroAuthResponse } from "./routes/auth"

var cors = require('cors');
require('dotenv').config({ path: '.env' })

const app = require('express')()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.end('hello world!')
})
app.use('/health', require('./routes/health.ts'))
app.use('/auth', require('./routes/auth.ts'))
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

interface IAppState {
  webapiSession?: string
  soapClient?: any
  apiAuth?: IAllegroAuthResponse
}

export const appState: IAppState = {}

app.get('/', function (req, res) {
  res.send('hello world')
})

const startup = async () => {
  appState.soapClient = await createSoapClient()
  await login()

  https.createServer({
    key: fs.readFileSync('server.key').toString(),
    cert: fs.readFileSync('server.cert').toString()
  }, app)
    .listen(port, function () {
      console.log(`mf backend listening on ${port}`)
    })
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