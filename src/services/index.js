import { config } from '../../config/index.js'
import { CITY_INFO, TYPE_LIST } from '../store/index.js'
import axios from 'axios'
import dayjs from 'dayjs'
import { randomNum } from '../utils/index.js'

/**
 * 获取 accessToken
 * @returns accessToken
 */
export const getAccessToken = async () => {
    // APP_ID
    const appId = config.APP_ID
    // APP_SECRET
    const appSecret = config.APP_SECRET
    // accessToken
    let accessToken = null
    
    const postUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`

    try {
        const res = await axios.get(postUrl).catch(err => err)
        if (res.status === 200 && res.data && res.data.access_token) {
            accessToken = res.data.access_token
        } else {
            console.error('获取 accessToken: 请求失败', res.data.errmsg)
        }
    } catch(e) {
        console.error('获取 accessToken: ', e)
    }

    return accessToken
}

/**
 * 获取天气情况
 * @param {*} province 省份
 * @param {*} city 城市
 */
export const getWeather = async (province, city) => {
    if (!CITY_INFO[province] || !CITY_INFO[province][city] || !CITY_INFO[province][city]["AREAID"]) {
        console.error('配置文件中找不到相应的省份或城市')
        return null
    }
    const address = CITY_INFO[province][city]["AREAID"]

    const url = `http://d1.weather.com.cn/dingzhi/${address}.html?_=${new Date()}` 

    const res = await axios.get(url, {
        headers: {
            "Referer": `http://www.weather.com.cn/weather1d/${address}.shtml`,
            'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`
        }
    }).catch(err => err)

    try {
        if (res.status === 200 && res.data) {
            const temp = res.data.split(";")[0].split("=")
            const weatherStr = temp[temp.length - 1]
            const weather = JSON.parse(weatherStr)
            if (weather.weatherinfo) {
                return weather.weatherinfo
            } else {
                throw new Error ('天气情况: 找不到weatherinfo属性, 获取失败')
            }
        } else {
            throw new Error(res)
        }
    } catch(e) {
        if (e instanceof SyntaxError ) {
            console.error('天气情况: 序列化错误', e)
        } else {
            console.error('天气情况: ', e)
        }
        return null
    }
}

/**
 * 金山词霸每日一句
 * @returns 
 */
export const getCIBA = async () => {
    const url = 'http://open.iciba.com/dsapi/'
    // const url = 'https://v.api.aa1.cn/api/yiyan/index.php'
    
    const res = await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
        }
    }).catch(err => err)

    // if (res.status === 200 && res) {
    //      const match = res.data.match(/<p>(.*?)<\/p>/);
    //       if (match && match[1]) {
    //         console.log('P 标签中的文字:', match[1]);
    //         return { content: '--' , note: match[1]}
    //       } else {
    //         console.log('未找到 <p> 标签');
    //            return { content:'--' , note: '--'}
    //       }

    //     // return res.data
    // }
    if (res.status === 200 && res) {
        return res.data
    }
    console.error('金山词霸每日一句: 发生错误', res)
    return null
}

/**
 * 好文节选
 * @param {*} type 
 * @returns 
 */
export const getOneTalk = async (type) => {

    const filterQuery = TYPE_LIST.filter(item => item.name === type);
    const query = filterQuery.length ? filterQuery[0].type : TYPE_LIST[randomNum(0, 7)].type
    const url = `https://v1.hitokoto.cn/?c=${query}`

    const res = await axios.get(url).catch(err => err)

    if (res.status === 200 && res) {
        return res.data
    }

    console.error('好文节选: 发生错误', res)
    return null

}

/**
 * 获取生日信息
 * @returns 
 */
export const getBirthdayMessage = () => {
    // 计算生日倒数
    const birthdayList = config.BIRTHDAYS
    let resMessage = ''
    birthdayList.forEach(birthday => {
        let birthdayMessage = null
        // 获取距离下次生日的时间
        const nextBir = dayjs(dayjs().format('YYYY') + '-' + birthday.date).diff(dayjs(), 'day')
        
        if (nextBir === 0) {
            birthdayMessage = `今天是 ${birthday.name} 生日哦，祝${birthday.name}生日快乐！`
        } else if (nextBir > 0 ) {
            birthdayMessage = `距离 ${birthday.name} 的生日还有${nextBir}天`
        }
        // 存储数据
        if (birthdayMessage) {
            resMessage += `${birthdayMessage} \n`
        }
    })

    return resMessage
}

/**
 * 发送消息模板
 * @param {*} accessToken 
 * @param {*} user 
 * @param {*} params 
 */
export const sendMessage = async (accessToken, user, params) => {
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`

    const wxTemplateData = {}
    params.map(item => {
        wxTemplateData[item.name] = {
            value: item.value,
            color: item.color
        }
    })
    
    // 组装数据
    const data = {
        "touser": user,
        "template_id": config.TEMPLATE_ID,
        // "url": "http://weixin.qq.com/download",
        "topcolor": "#FF0000",
        // "miniprogram": {
        //     "appid": "wx8382f2d0ab4a08eb", 
        //     "pagepath": "pages/index/index", 
        //     "title": "home" 
        //   },
        "data": wxTemplateData
    }

    console.log('将要发送以下内容: ', data)

    // 发送消息
    const res = await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
        }
    }).catch(err => err)


    if (res.data && res.data.errcode === 0) {
        console.log('推送消息成功')
        return true
    }
    console.error('推送失败！', res.data)
    return false
}
