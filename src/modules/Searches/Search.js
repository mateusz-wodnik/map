import React from 'react';

const Search = ({ marker, term }) => {
	const { name, phone, destination, active } = marker
	return(
		<article className="searches__marker">
			<p>{name}</p>
			<small>{phone}</small>
			<p>{destination && destination.distance.text}</p>
			<p>{destination && destination.duration.text}</p>
			<input type="checkbox"
						 name="marker"
						 id={name}
						 data-term={term}
						 className="searches__toggle searches__toggle--marker"
						 defaultChecked={active}
			/>
		</article>
	)
}

export default Search
