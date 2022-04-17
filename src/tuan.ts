import qs from 'qs'
import { config } from "./const"
import { sendDefaultMail } from "./mail"
import { request } from './utils'

const apiHeaders = {
  'Host': 'tuanapi.12355.net',
  'Connection': 'keep-alive',
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Origin': 'https://tuan.12355.net',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 11; M2012K11AC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.62 XWEB/2691 MMWEBSDK/201101 Mobile Safari/537.36 MMWEBID/8628 MicroMessenger/7.0.21.1783(0x27001543) Process/tools WeChat/arm64 Weixin GPVersion/1 NetType/WIFI Language/zh_CN ABI/arm64',
  'X-Requested-With': 'com.tencent.mm',
  'Sec-Fetch-Site': 'same-site',
  'Sec-Fetch-Mode': 'cors',
  'Referer': 'https://tuan.12355.net/wechat/view/YouthLearning/page.html',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
}
const youthstudyHeaders = {
  'Host': 'youthstudy.12355.net',
  'Connection': 'keep-alive',
  'Origin': 'https://youthstudy.12355.net',
  'X-Litemall-IdentiFication': 'young',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 11; M2012K11AC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.62 XWEB/2691 MMWEBSDK/201101 Mobile Safari/537.36 MMWEBID/8628 MicroMessenger/7.0.21.1783(0x27001543) Process/tools WeChat/arm64 Weixin GPVersion/1 NetType/WIFI Language/zh_CN ABI/arm64',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': '*/*',
  'X-Requested-With': 'com.tencent.mm',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-Mode': 'cors',
  'Referer': 'https://youthstudy.12355.net/h5/',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
}


async function getSign(mid: string) {
  const data = await request<{ youthLearningUrl: string }>({ method: 'get', url: `https://tuanapi.12355.net/questionnaire/getYouthLearningUrl`, headers: apiHeaders, params: { mid } })
  return data.youthLearningUrl.split('?')[1].slice(5)
}
async function getToken(sign: string) {
  const data = await request({ method: 'post', url: 'https://youthstudy.12355.net/apih5/api/user/get', headers: youthstudyHeaders, data: qs.stringify({ sign }) })
  return data.data.entity.token
}
async function getChapterId() {
  const data = await request({ method: 'get', url: 'https://youthstudy.12355.net/apih5/api/young/chapter/new', headers: { 'X-Litemall-IdentiFication': 'young' } })
  return data.data.entity.id
}
async function saveHistory(token: string, chapterId: string) {
  return await request({ method: 'post', url: "https://youthstudy.12355.net/apih5/api/young/course/chapter/saveHistory", headers: { ...youthstudyHeaders, "X-Litemall-Token": token }, data: qs.stringify({ chapterId }) })
}

(async function () {
  const sign = await getSign(config.mid)
  const token = await getToken(sign)
  const chapterId = await getChapterId()
  const res = await saveHistory(token, chapterId)
  sendDefaultMail({
    subject: `tuan课打卡:${res.msg}`,
    text: JSON.stringify(res)
  })
})()