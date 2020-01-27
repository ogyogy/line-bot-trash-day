'use strict';
const line = require('@line/bot-sdk');
const client = new line.Client({ channelAccessToken: process.env.ACCESSTOKEN });

function getTrush(weekdayJpn, weekNumber) {
    let trush = '該当なし';
    if (weekdayJpn == '月' || weekdayJpn == '木') {
        trush = '可燃ごみ';
    } else if (weekdayJpn == '水' && (weekNumber == 1 || weekNumber == 3)) {
        trush = '不燃ごみ';
    } else if (weekdayJpn == '火') {
        trush = '資源';
    }
    return trush;
}

function getWeekNumber(date) {
    // 引数のDateオブジェクトが第何週目かを返す
    return Math.floor((date.getDate() - 1) / 7) + 1;
}

function pushError(err) {
    client.pushMessage(process.env.USERID, {
        'type': 'text',
        'text': err.toString()
    });
}

function pushTrushDay() {
    try {
        // Lambda側で環境変数TZにAsia/Tokyoを設定する
        let date = new Date();
        // Sunday - Saturday : 0 - 6
        let weekday = date.getDay();
        let weekdayJpn = ['日', '月', '火', '水', '木', '金', '土'][weekday];
        let weekNumber = getWeekNumber(date);
        let text = (date.getMonth() + 1) + '/' + date.getDate();
        text += ' 第' + weekNumber + weekdayJpn + '曜日 ';
        text += getTrush(weekdayJpn, weekNumber);
        const message = {
            'type': 'text',
            'text': text
        };
        client.pushMessage(process.env.USERID, message);
    } catch (err) {
        pushError(err);
    }
}

exports.handler = function (event, context) {
    pushTrushDay();
};