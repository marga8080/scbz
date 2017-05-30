import React, {Component} from 'react';
import Lunar from './utils/Lunar';
import Bazi from './utils/Bazi';
import DateUtil from './utils/DateUtil';

import {Select} from 'antd';
const Option = Select.Option;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lunar: {},
            solar: null,
            scbz: {},
            sc: null,
            mdays: 31,
            y : null,
            m : null,
            d : null,
            h : null,
        };
    }


    componentWillMount() {
        let date = new Date();
        this._calc(date);

        this.setState({
            y : date.getFullYear() ,
            m : date.getMonth(),
            d : date.getDate(),
            h : date.getHours(),
        });
    }

    _calc(date) {
        let lunar = Lunar.calc(date);
        //console.log(lunar);
        this.setState({lunar: lunar});
        let solar = DateUtil.format(date, "yyyy年MM月dd日 hh时");
        //console.log(solar);
        this.setState({solar: solar});
        let sc = Bazi.cHour(date.getHours());
        this.setState({sc: sc});
        //console.log(sc)
        let scbz = Bazi.calc(date);
        this.setState({scbz: scbz});
    }

    _onYearChange(value) {
        let date = new Date(value, this.state.m, this.state.d, this.state.h);
        this.setState({y : value});
        this._calc(date);
    }

    _onMonthChange(value) {
        let d = this.state.d;
        let maxD = Bazi.solarDays(this.state.y, value);
        if (d > maxD) { //二月的时候
            d = maxD;
            this.setState({d : maxD});
        }
        let date = new Date(this.state.y, value, d, this.state.h);
        this.setState({m : value});
        this._calc(date);
    }

    _onDayChange(value) {
        let date = new Date(this.state.y, this.state.m, value, this.state.h);
        this.setState({d : value});
        this._calc(date);
    }

    _onHourChange(value) {
        let date = new Date(this.state.y, this.state.m, this.state.d, value);
        this.setState({h : value});
        this._calc(date);
    }


    render() {
        let yearList = [];
        for (let i = 1901; i < 2050; i++) {
            yearList.push(i);
        }
        let monthList = [];
        for (let i = 0; i < 12; i++) {
            monthList.push(i);
        }
        let dayList = [];
        for (let i = 1; i <= Bazi.solarDays(this.state.y, this.state.m); i++) {
            dayList.push(i);
        }
        let hourList = [];
        for (let i = 0; i < 24; i++) {
            hourList.push(i);
        }

        return (
            <div style={{padding: 10,fontSize:16}}>
                <div style={{marginTop: 10, marginBottom: 10,}}>
                    <Select
                        onChange={this._onYearChange.bind(this)}
                        value={this.state.y + ""}
                        style={{width: 70}}>
                        {yearList.map((item) => {
                            return (<Option value={item + ""} key={item}>{item}</Option>);
                        })}
                    </Select>
                    年
                    <Select
                        onChange={this._onMonthChange.bind(this)}
                        value={this.state.m + ""}
                        style={{width: 50}}>
                        {monthList.map((item) => {
                            return (<Option value={item + ""} key={item}>{item+1}</Option>);
                        })}
                    </Select>
                    月
                    <Select
                        onChange={this._onDayChange.bind(this)}
                        value={this.state.d + ""}
                        style={{width: 50}}>
                        {dayList.map((item) => {
                            return (<Option value={item + ""} key={item}>{item}</Option>);
                        })}
                    </Select>
                    日
                    <Select
                        onChange={this._onHourChange.bind(this)}
                        value={this.state.h + ""}
                        style={{width: 50}}>
                        {hourList.map((item) => {
                            return (<Option value={item + ""} key={item}>{item}</Option>);
                        })}
                    </Select>
                    时
                </div>
                公历：{this.state.solar}
                <br/>
                农历：{this.state.lunar.str}&nbsp;&nbsp; {this.state.sc}时
                <br/>
                <hr/>
                八字：{this.state.scbz.bz}
                <br/>
                五行：{this.state.scbz.wx}
                <br/>
                方位：{this.state.scbz.fw}


            </div>
        );
    }
}

export default App;
