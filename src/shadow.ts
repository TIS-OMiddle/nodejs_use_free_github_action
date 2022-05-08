import { config } from "./const";
import { sendDefaultMail } from "./mail";
import { execute, request, requestCookies } from "./utils";
import cookie from 'cookie'
import qs from "qs";

const loginHeaders = {
  'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Microsoft Edge";v="100"',
  'sec-ch-ua-mobile': '?0',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.44',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Referer': 'https://www.shadowsky.fun/auth/login?goto=/user',
  'X-Requested-With': 'XMLHttpRequest',
  'sec-ch-ua-platform': '"Windows"'
};
const dakaHeaders = {
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8,en-GB;q=0.7,en-US;q=0.6',
  'Connection': 'keep-alive',
  'Content-Length': '0',
  'Cookie': 'sid=8c87512190c8379d14f1c2a6fb7d89de52abe0fad2d9448d1204b915fc17d026',
  'Origin': 'https://www.shadowsky.fun',
  'Referer': 'https://www.shadowsky.fun/user',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.44',
  'X-Requested-With': 'XMLHttpRequest',
  'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Microsoft Edge";v="100"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"'
};

execute('shadow', async () => {
  const cookies = await requestCookies({
    method: 'post',
    url: 'https://www.shadowsky.fun/auth/login',
    data: config.shadowToken,
    headers: loginHeaders,
  })
  const sid = cookies.map(i => cookie.parse(i)).find(i => !!(i?.sid)).sid
  const res = await request({
    method: 'post',
    url: 'https://www.shadowsky.fun/user/checkin',
    headers: { ...dakaHeaders, Cookie: qs.stringify({ sid }) },
  })
  sendDefaultMail({
    subject: `ss打卡:${res.msg}`,
    text: JSON.stringify(res)
  })
})


