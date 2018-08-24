import React from 'react';
import './Searches.css'
import Search from './Search'

const Searches = ({toggleMarkers, markers}, children) => (
	<section className="searches" onChange={toggleMarkers}>
		{Object.keys(markers).map((name, idx) => (
			<div key={name + idx} className={`searches__term searches__term--${name}`}>
				<header className="searches__header">
					<h2 className="searches__name">{name}</h2>
					<input type="checkbox"
								 name="term"
								 id={name}
								 className="searches__toggle searches__toggle--term"
								 defaultChecked={true}
					/>
				</header>
				<section className="searches__list">
					{markers[name].map((marker, idx) => (
						<Search key={marker.name+idx}
										term={name}
										marker={marker}
						/>
					))}
				</section>
			</div>
		))}
	</section>
)

export default Searches
