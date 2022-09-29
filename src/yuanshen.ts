import { config } from "./const"
import { sendDefaultMail } from "./mail"
import { execute, request } from './utils'
import md5 from 'crypto-js/md5'

// 打开 http://bbs.mihoyo.com/ys + http://user.mihoyo.com

function getDs() {
  const randomStr = Math.random().toString(16).slice(2, 8)
  const timestamp = Math.floor(Date.now() / 1000)

  // iOS sign
  const sign = md5(`salt=9nQiU3AV0rJSIBWgdynfoGMGKaklfbM7&t=${timestamp}&r=${randomStr}`)
  const DS = `${timestamp},${randomStr},${sign}`
  return DS
}

const ACT_ID = 'e202009291139501'
const APP_VERSION = '2.34.1'
const headers = {
  'Accept-Encoding': 'gzip, deflate, br',
  'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/${APP_VERSION}`,
  Referer: `https://webstatic.mihoyo.com/bbs/event/signin-ys/index.html?bbs_auth_required=true&act_id=${ACT_ID}&utm_source=bbs&utm_medium=mys&utm_campaign=icon`,
  Cookie: config.miHaYouToken,
  'DS': getDs(),
  'x-rpc-app_version': APP_VERSION,
  'x-rpc-client_type': '5',
  "x-rpc-device_id": "bd7f912e-908c-3692-a520-e70206823495"
}

async function daka() {
  const gameInfo = await request({
    method: 'GET',
    url: 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn',
    headers
  })
  const result = await request({
    method: 'POST',
    url: 'https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign',
    headers,
    data: {
      "act_id": ACT_ID,
      "region": gameInfo['data']['list'][0]['region'],
      "uid": gameInfo['data']['list'][0]['game_uid']
    }
  })
  return result
}

execute('yuanshen', async () => {
  const res = await daka()
  if (res.ret_code !== 0) {
    throw res
  }
})
