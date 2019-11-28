import * as axios from 'axios'
import { base64StringEncode } from '../util/util'

export const restTokenAuth = ():Promise<AccessTokenResponse> => {
  const cliendId = process.env.ALLEGRO_CLIENT_ID
  const clientSecret = process.env.ALLEGRO_CLIENT_SECRET
  const ALLEGRO_URL = process.env.ALLEGRO_URL

  const clientBase64 = base64StringEncode(`${cliendId}:${clientSecret}`)

  return new Promise((resolve,reject)=> {
    axios.default({
      method: 'post',
      url: `${ALLEGRO_URL}/auth/oauth/token?grant_type=client_credentials`,
      headers: {
        Authorization: `Basic ${clientBase64}`
      }
    }).then((response)=>{
      const res:AccessTokenResponse = response.data
      resolve(res)
    }).catch(function (error) {
      reject(error)
    })
  })
}

export interface AccessTokenResponse {
    access_token: string
    token_type: string
    expires_in: number
    scope: string
    jti: string
}