/**
 * Created by mawei on 2017/5/29.
 */


const solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
//const Animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
//const solarTerm = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"];
const sTermInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];

/* eslint-disable */
export default class Bazi {

    /**
     * 传入 offset 返回干支, 0=甲子
     * @param num
     * @returns {*}
     */
    static cyclical(num) {
        return (Gan[num % 10] + Zhi[num % 12]);
    }

    /**
     * 返回公历 y年某m+1月的天数
     * @param y
     * @param m
     * @returns {*}
     */
    solarDays(y, m) {
        if (m === 1) {
            return ((y % 4 === 0) && (y % 100 !== 0) || (y % 400 === 0)) ? 29 : 28;
        } else {
            return solarMonth[m];
        }
    }

    /**
     * 某年的第n个节气为几日(从0小寒起算)
     * @param y
     * @param n
     * @returns {number}
     */
    static sTerm(y, n) {
        var offDate = new Date(( 31556925974.7 * (y - 1900) + sTermInfo[n] * 60000  ) + Date.UTC(1900, 0, 6, 2, 5));
        return (offDate.getUTCDate());
    }

    /**
     *
     * @param y
     * @param m
     * @param d
     * @constructor
     */
    static calc(objDate) {
        let y = objDate.getFullYear(),
            m = objDate.getMonth(),
            d = objDate.getDate(),
            h = objDate.getHours();

        var cY, cM, cD; //年柱,月柱,日柱

        ////////年柱 1900年立春后为庚子年(60进制36)
        if (m < 2) {
            cY = this.cyclical(y - 1900 + 36 - 1);
        } else {
            cY = this.cyclical(y - 1900 + 36);
        }
        var term2 = this.sTerm(y, 2); //立春日期
        //依节气调整二月分的年柱, 以立春为界
        if (m === 1 && d >= term2) cY = this.cyclical(y - 1900 + 36);

        ////////月柱 1900年1月小寒以前为 丙子月(60进制12)
        var firstNode = this.sTerm(y, m * 2) //返回当月「节」为几日开始
        cM = this.cyclical((y - 1900) * 12 + m + 12);
        //依节气月柱, 以「节」为界
        if (d >= firstNode) cM = this.cyclical((y - 1900) * 12 + m + 13);


        //当月一日与 1900/1/1 相差天数
        //1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
        var dayCyclical = Date.UTC(y, m, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
        //日柱
        cD = this.cyclical(dayCyclical + d - 1);

        let json = {};

        json.nz = cY;
        json.yz = cM;
        json.rz = cD;
        json.sz = this.calcSz(cD, h);

        //八字
        json.bz = json.nz + "、" + json.yz + "、" + json.rz + "、" + json.sz;
        //五行
        json.wx = this.calcWxFw(json.nz).wx + "、" + this.calcWxFw(json.yz).wx + "、" + this.calcWxFw(json.rz).wx + "、" + this.calcWxFw(json.sz).wx;
        //方位
        json.fw = this.calcWxFw(json.nz).fw + "、" + this.calcWxFw(json.yz).fw + "、" + this.calcWxFw(json.rz).fw + "、" + this.calcWxFw(json.sz).fw;

        return json;
    }

    /**
     * 计算时柱 （论日上起时）
     * 甲己还加甲，
     * 乙庚丙作初，
     * 丙辛从戊起，
     * 丁壬庚子居，
     * 戊癸何方发，
     * 壬子是真途
     * @param m
     */
    static calcSz(rz, hour) {
        let rg = rz.substr(0, 1);
        let st = 0;
        let x = Math.ceil(hour / 2) % 12; //计算出时辰是第几位
        if (rg === "甲" || rg === "己") {
            st = 1; //"甲";
        } else if (rg === "乙" || rg === "庚") {
            st = 3; //"丙";
        } else if (rg === "丙" || rg === "辛") {
            st = 5;//"戊";
        } else if (rg === "丁" || rg === "壬") {
            st = 7;//"庚";
        } else if (rg === "戊" || rg === "癸") {
            st = 9;//"壬";
        }
        return Gan[(x + st - 1) % 10] + Zhi[x];
    }

    /**
     * 计算时辰
     * @param hour
     * @returns {string}
     */
    static cHour(hour) {
        let x = Math.ceil(hour / 2) % 12;
        return Zhi[x];
    }

    /**
     * 金：天干的庚、辛 地支金：申、酉
     * 木：天干的甲、乙 地支木：寅、卯
     * 水：天干的壬、癸 地支水：子、亥
     * 火：天干的丙、丁 地支火：巳、午
     * 土：天干的戊、己 地支土：丑、辰、未、戌
     * 计算五行方位
     */
    static calcWxFw(gz) {
        let Wx = ["木", "火", "土", "金", "水"];
        let Fw = ["东", "南", "中", "西", "北"];
        let json = {};
        let tg = gz.substr(0, 1);
        let tgi = Gan.indexOf(tg);
        json.fw = Fw[((tgi/2) | 1) % 5];
        json.wx = Wx[((tgi/2) | 1) % 5];

        let dz = gz.substr(1, 1);
        switch (dz) {
            case "申" :
            case "酉" : json.wx +="金"; json.fw += "西"; break;
            case "寅" :
            case "卯" : json.wx +="木"; json.fw += "东"; break;
            case "子" :
            case "亥" : json.wx +="水"; json.fw += "北"; break;
            case "巳" :
            case "午" : json.wx +="火"; json.fw += "南"; break;
            default : json.wx +="土"; json.fw += "中";
        }

        return json;
    }


}