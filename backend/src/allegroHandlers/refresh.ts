import * as axios from 'axios'
import { base64StringEncode } from '../util/util'
import { appState } from '..'

export const refreshAuth = (refresh_token: string) => {
  axios.default({
    method: 'post',
    url: `https://allegro.pl/auth/oauth/token?grant_type=refresh_token&refresh_token=${refresh_token}&redirect_uri=${process.env.ALLEGRO_APP_REDIRECT_URI}`,
    headers: {
      Authorization: `Basic ${base64StringEncode(`${process.env.ALLEGRO_API_CLIENT_ID}:${process.env.ALLEGRO_API_CLIENT_SECRET}`)}`
    }
  }).then((response) => {
    console.log(response.data)
    appState.apiAuth = response.data
  }).catch(function (error) {
    console.log(error)
  })
  //
}