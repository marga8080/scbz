import React, {Component} from 'react';
import Lunar from './utils/Lunar'
import DateUtil from './utils/DateUtil'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {lunar : {}, solar : null};
    }

    componentDidMount() {
        let lunar = Lunar.calc(new Date());
        console.log(lunar);
        this.setState({lunar : lunar});
        let solar = DateUtil.format(new Date(), "yyyy年MM月dd日 hh时");
        console.log(solar);
        this.setState({solar : solar});
    }


    render() {
        return (
            <div>
                现在是：{this.state.solar}
                <br/>
                农历：{this.state.lunar.str}

            </div>
        );
    }
}

export default App;
