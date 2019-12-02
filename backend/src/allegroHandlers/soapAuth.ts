import * as soap from 'soap'
import { appState } from '..';

export const createSoapClient = () => {
    return new Promise((resolve, reject) => {
        try {
            const url = process.env.ALLEGRO_WDSL_URL
            soap.createClient(url, function (err, client) {
                resolve(client)
            });
        }
        catch (e) {
            reject(e)
        }
    });
}

export const doLoginWithAccessToken = (client: any, accessToken: string) => {
    return new Promise<IdoLoginWithAccessTokenResponse>((resolve, reject) => {
        client.doLoginWithAccessToken({
            accessToken: accessToken,
            countryCode: 1,
            webapiKey: process.env.ALLEGRO_WEBAPI_KEY
        }, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
                console.log(result)
            }
        });
    });
}

export interface IdoLoginWithAccessTokenResponse {
    sessionHandlePart: string
    userId: string
    serverTime: string
}

export const login = async () => {
    console.log('logging in to webApi with access token')
    const s = await doLoginWithAccessToken(appState.soapClient, appState.apiAuth.access_token)
    appState.webapiSession = s.sessionHandlePart
}