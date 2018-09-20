import React, {Component} from 'react'
import './Welcome.css'
import SearchContainer from '../Search/SearchContainer'

class Welcome extends Component {
	state = {
		show: true
	}

    handleSearch = (show) => this.setState({show})
	render() {
		const {show} = this.state
        return(
            <div className="welcome">
                <h1>Hi! Write below what should I find for you ;)</h1>
				{show && <SearchContainer callback={this.handleSearch} />}
                <button disabled={show} className="welcome__hide" onClick={(e) => e.target.parentNode.style.display = 'none'}>
                    See the results
                </button>
            </div>
        )
	}
}

export default Welcome
