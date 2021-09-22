import Api from './api'
import Player from './helpers/Player'
import JellySocket from './ws'

export const api = new Api()
export const ws = new JellySocket()
export const player = new Player()
