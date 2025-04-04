export const config = {
    /**
     * 公众号配置
     */

    // 公众号APP_ID
    APP_ID: "wx4907b8da44fc837e",
    // 公众号APP_SECRET
    APP_SECRET: "cefbda19e6a9f124bbbc40746b6caa2d",
    // 模板消息id
    TEMPLATE_ID: "6YyaKQyAhDpHIbstLYjFxQsoqF0PjVuEYtLSb4UZz8s",
    // 接收公众号消息的微信号，如果有多个，需要在[]里用英文逗号间隔，例如["wx1", "wx2"]
    // , "omJbn6-iYVh8cOvvZPyCndimhknU" ,"omJbn6-iYVh8cOvvZPyCndimhknU"
    USERS: ["omJbn6zSC8sBB5ZFT_xfYYS8ohEE","omJbn6-iYVh8cOvvZPyCndimhknU"],
     
    /**
     * 信息配置
     */

    /** 天气相关 */

    // 所在省份
    PROVINCE: "山东",
    // 所在城市
    CITY: "济南",

    /** 生日相关 */

    // 生日，修改名字为对应需要显示的名字, data 仅填月日即可, 请严格按照示例填写
    BIRTHDAYS: [
      {"name": "老婆", "year": "1993", "date": "12-27"},
      {"name": "家公", "year": "1993", "date": "08-09"},
    ],

    /** 日期相关 */

    // 在一起的日子，格式同上
    LOVE_DATE: "2021-07-01",
    // 结婚纪念日
    MARRY_DATE: "2020-01-04",


    /** 好文节选 */

    // 好文节选的内容类型
    // 可以填写【动画，漫画，游戏，小说，原创，网络，其他】； 随机则填写 ""
    LITERARY_PREFERENCE: "小说"


    }

// {{date.DATA}}  
// 城市：{{city.DATA}}  
// 天气：{{weather.DATA}}  
// 最低气温: {{min_temperature.DATA}}  
// 最高气温: {{max_temperature.DATA}}  
// 今天是我们恋爱的第{{love_day.DATA}}天
// 今天是我们结婚的第{{marry_day.DATA}}天
// {{birthday_message.DATA}}

// {{note_en.DATA}}  
// {{note_ch.DATA}}
