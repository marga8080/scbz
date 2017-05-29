import React, {Component} from 'react';
import Lunar from './utils/Lunar';
import Bazi from './utils/Bazi';
import DateUtil from './utils/DateUtil';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {lunar : {}, solar : null, scbz : {}, sc : null};
    }

    componentDidMount() {
        let date = new Date();
        let lunar = Lunar.calc(date);
        console.log(lunar);
        this.setState({lunar : lunar});
        let solar = DateUtil.format(date, "yyyy年MM月dd日 hh时");
        console.log(solar);
        this.setState({solar : solar});
        let sc = Bazi.cHour(date.getHours());
        this.setState({sc : sc});
        console.log(sc)
        let scbz = Bazi.calc(date);
        this.setState({scbz : scbz});
    }


    render() {
        return (
            <div>
                现在是
                <br/>
                公历：{this.state.solar}
                <br/>
                农历：{this.state.lunar.str} {this.state.sc}时
                <hr/>
                八字：{this.state.scbz.str}
            </div>
        );
    }
}

export default App;
