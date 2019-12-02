import * as fs from 'fs'
import { appState } from '..'

export const saveAuth = () => {
  fs.writeFile('auth.json', JSON.stringify(appState.apiAuth), file => {
    console.log('auth saved to disk')
  })
}

export const readAuth = () => {
  const previousAuthExists = fs.existsSync('auth.json')
  if (previousAuthExists) {
    const auth = fs.readFileSync('auth.json').toString()
    appState.apiAuth = JSON.parse(auth)
  }
}