import { createSoapClient, doLoginWithAccessToken, login, refreshToken } from "./allegroHandlers/soapAuth"
import * as bodyParser from 'body-parser'
import { IAllegroAuthResponse } from "./routes/auth"
import { refreshAuth } from "./allegroHandlers/refresh";

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
  console.log(`auth on: https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=${process.env.ALLEGRO_API_CLIENT_ID}&redirect_uri=${process.env.ALLEGRO_APP_REDIRECT_URI}`)
  app.listen(port, () => console.log(`listening on ${port}`))
  refreshTokenJob(60)
}

async function refreshTokenJob(minutes: number) {
  setInterval(async function () {
    if (appState.apiAuth) {
      console.log('refreshing access token')
      refreshAuth(appState.apiAuth.refresh_token)
    }
  }, minutes * 60 * 1000);
}
startup()