import * as express from 'express'
import * as axios from 'axios'

import * as fs from 'fs'
import { appState } from '..'
import { base64StringEncode } from '../util/util'
import { login } from '../allegroHandlers/soapAuth'

const router = express.Router()

router.post('/:code', async (req, res) => {
  const code = req.params.code
  if (code) {
    const auth = await authorizeCode(code)
    appState.apiAuth = auth
    await login()
    // saveAuth()
  }

  res.json({
    status: code ? 'code received' : 'no code'
  })
})

export const authorizeCode = (code: string): Promise<IAllegroAuthResponse> => {
  return new Promise((resolve, reject) => {
    axios.default({
      method: 'get',
      url: `https://allegro.pl/auth/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${process.env.ALLEGRO_APP_REDIRECT_URI}`,
      headers: {
        Authorization: `Basic ${base64StringEncode(`${process.env.ALLEGRO_API_CLIENT_ID}:${process.env.ALLEGRO_API_CLIENT_SECRET}`)}`
      }
    }).then((response) => {
      resolve(response.data)
    }).catch(function (error) {
      reject(error)
    })
  })
}

export interface IAllegroAuthResponse {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
  jti: string
}

module.exports = router