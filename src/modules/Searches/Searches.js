import React, { Component } from 'react'
import './Searches.css'
import SearchResult from './SearchResult'

class Searches extends Component {
	state = {
		selected: [],
		openFocus: false
	}
	// Updating state on sorting options change
	handleSelect = (e) => {
		this.setState({selected: [...e.target.options].filter(option => option.selected)})
	}
	// Handle sorting response places
	handleSorting = (markers, selected) => {
		let sorted = [...markers]
		selected.forEach(filter => {
			sorted = sorted.sort(this.props.filters[filter.value])
		})
		return sorted
	}

	render = () => {
		const {updateMarkers, moreRecords, markers, filters, totals, handleHover} = this.props
		return (
			<section className="searches" onChange={updateMarkers}>
				{Object.keys(markers).map((name, idx) => (
					<div key={name + idx} className={`searches__term searches__term--${name}`}>
						<input type="checkbox" aria-label="open dropdown" className="searches__open" onChange={(e) => this.setState({openFocus: e.target.checked})} />
						<header className="searches__header">
							<h2 className="searches__name">{name}</h2>
							<select defaultValue="" onChange={this.handleSelect} className="searches__filter" name="filter" id="filter">
								{Object.keys(filters).map(type => <option key={type} value={type}>{type}</option>)}
								<option value="" disabled>Sort results...</option>
							</select>
							<button onClick={() => moreRecords(name)} disabled={totals[name] === this.props.markers[name].length}>
								{totals[name] === markers[name].length ? 'Full' : 'More...'}
							</button>
							<input type="checkbox"
										 name="term"
										 id={name}
										 className="searches__toggle searches__toggle--term"
										 defaultChecked={true}
							/>
						</header>
						<section className="searches__list">
							{this.handleSorting(markers[name], this.state.selected).map((marker, idx) => (
								<SearchResult key={marker.name+idx}
															openFocus={this.state.openFocus}
															term={name}
															marker={marker}
															handleHover={handleHover}
								/>
							))}
						</section>
					</div>
				))}
			</section>
		)
	}
}

export default Searches
