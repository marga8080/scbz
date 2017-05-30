/**
 * Created by mawei on 2017/5/29.
 */

/*前4位，即0在这一年是润年时才有意义，它代表这年润月的大小月，为1则润大月，为0则润小月。
 中间12位，即4bd，每位代表一个月，为1则为大月，为0则为小月。
 最后4位，即8，代表这一年的润月月份，为0则不润。首4位要与末4位搭配使用。
 */

const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0];

/* eslint-disable */
export default class Lunar {

    /**
     *  y年闰哪个月
     * @param y
     * @returns {number} y年闰哪个月 1-12,没闰传回 0
     */
    static leapMonth(y) {
        //& 0xf 十六进制取 最后4位
        return (lunarInfo[y - 1900] & 0xf);
    }

    /**
     * y年闰月的天数
     * @param y
     * @returns {number} y年闰月的天数
     */
    static leapDays(y) {
        if (this.leapMonth(y)) {
            return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
        } else {
            return 0;
        }
    }

    /**
     * y年m月的总天数
     * @param y
     * @param m 从1开始到12
     * @returns {number} y年m月的总天数
     */
    static monthDays(y, m) {
        return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
    }



    /**
     * y年的总天数
     * @param year
     * @returns {*} y年的总天数
     */
    static lYearDays(year) {
        var i, f, sumDay, info;
        sumDay = 348; //29天 X 12个月
        i = 0x8000; //0x8000 = 1000 0000 0000 0000
        //0x04BD8  & 0x0FFFF 中间12位，即4BD，每位代表一个月，为1则为大月，为0则为小月
        info = lunarInfo[year - 1900] & 0x0FFFF;
        //计算12个月中有多少天为30天
        for (var m = 0; m < 12; m++) {
            f = info & i; // 0x04BD8  & 0x0FFFF  & 0x8000[1000 0000 0000 0000]
            if (f !== 0) {
                sumDay++;
            }
            i = i >> 1;//右移一位 算二月
        }
        return sumDay + this.leapDays(year);
    }

    /**
     * 计算
     * @param objDate
     */
    static calc(objDate) {
        let json = {};

        //年==============================
        let i, leap = 0, temp = 0;
        //与1900-1-31间隔天数
        let offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;

        //算出与今年间隔天数
        for (i = 1900; i < 2050 && offset > 0; i++) {
            temp = this.lYearDays(i);
            offset -= temp;
        }

        if (offset < 0) {
            offset += temp;
            i--;
        }

        json.year = i;

        //月===============================
        leap = this.leapMonth(i); //闰哪个月
        json.isLeap = false;

        //算出当月间隔天数
        for (i = 1; i <= 12 && offset > 0; i++) {
            //闰月
            if (leap > 0 && i === (leap + 1) && json.isLeap === false) {
                --i;
                json.isLeap = true;
                temp = this.leapDays(json.year);
            } else {
                temp = this.monthDays(json.year, i);
            }

            //解除闰月
            if (json.isLeap === true && i === (leap + 1)) {
                json.isLeap = false;
            }
            offset -= temp;
        }

        //刚好是闰月的第一天
        if (offset === 0 && leap > 0 && i === leap + 1) {
            if (json.isLeap) { //未解除闰月说明此月非闰月
                json.isLeap = false;
            } else {
                json.isLeap = true;
                --i;
            }
        }

        if (offset < 0) {
            offset += temp;
            --i;
        }

        json.month = i;
        json.day = offset + 1;

        json.cYear = this.cYear(json.year);
        json.cMonth = this.cMonth(json.month);
        json.cDay = this.cDay(json.day);

        json.str = json.cYear + "年" + (json.isLeap ? "润" : "") + json.cMonth + json.cDay;

        return json;
    }

    static cYear(y) {
        var Gan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");
        var Zhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");

        return Gan[(y - 1900 + 6) % 10] + Zhi[(y - 1900) % 12];
    }


    static cMonth(m) {
        var nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
        var s;
        if (m > 10) {
            s = '十' + nStr1[m - 10];
        } else {
            s = nStr1[m] ;
        }
        s += '月';
        return s;
    }

    static cDay(d) {
        var nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
        var nStr2 = new Array('初', '十', '廿', '卅', '');
        var s = "";
        switch (d) {
            case 10: s = '初十'; break;
            case 20: s = '二十'; break;
            case 30: s = '三十'; break;
            default: s = nStr2[Math.floor(d / 10)]; s += nStr1[d % 10];
        }
        return (s);
    }

}
