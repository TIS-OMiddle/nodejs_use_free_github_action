import { config } from "./const"
import { sendDefaultMail } from "./mail"
import { execute, request } from './utils'
import md5 from 'crypto-js/md5'

function getDs() {
  const salt = 'h8w582wxwgqvahcdkpvdhbh2w9casgfl'
  const timestamp = Math.round(Date.now() / 1000).toString()
  const random_string = Math.random().toString(16).slice(2, 8)
  const ds_string = 'salt=' + salt + '&t=' + timestamp + '&r=' + random_string
  const ds_md5 = md5(ds_string)
  const ds = timestamp + ',' + random_string + ',' + ds_md5
  return ds
}

async function daka() {
  const gameInfo = await request({
    method: 'GET',
    url: 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn',
    headers: {
      Cookie: config.miHaYouToken
    }
  })
  const result = await request({
    method: 'POST',
    url: 'https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign',
    headers: {
      Cookie: config.miHaYouToken,
      'DS': getDs(),
      'x-rpc-app_version': '2.3.0',
      'x-rpc-client_type': '5',
      "x-rpc-device_id": "bd7f912e-908c-3692-a520-e70206823495"
    },
    data: {
      "act_id": "e202009291139501",
      "region": gameInfo['data']['list'][0]['region'],
      "uid": gameInfo['data']['list'][0]['game_uid']
    }
  })
  return result
}

execute('yuanshen', async () => {
  const res = await daka()
  sendDefaultMail({
    subject: `原神打卡:${res.message}`,
    text: JSON.stringify(res)
  })
})
