import React from 'react';
import './Searches.css'

const Searches = ({toggleMarkers, markers}) => (
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
						<article key={marker.name + idx} className="searches__marker">
							<p>{marker.name}</p>
							<small>{marker.phone}</small>
							<p>{marker.destination && marker.destination.distance.text}</p>
							<p>{marker.destination && marker.destination.duration.text}</p>
							<input type="checkbox"
										 name="marker"
										 id={marker.name}
										 data-term={name}
										 className="searches__toggle searches__toggle--marker"
										 defaultChecked={marker.active}
							/>
						</article>
					))}
				</section>
			</div>
		))}
	</section>
)

export default Searches
