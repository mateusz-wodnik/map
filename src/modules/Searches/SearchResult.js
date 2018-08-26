import React from 'react';
import './SearchResult.css'

const SearchResult = ({ marker, term, handleHover }) => {
	const { name, phone, display_phone, location, rating, url, distance, image_url, active } = marker
	return (
		<article onMouseOver={() => handleHover(name, term, true)}
						 onMouseOut={() => handleHover(name, term, false)}
						 className="searches__search search-result"
						 style={{backgroundImage: `url(${image_url})`}}
		>
			<div className="search-result__mask">
				<header className="search-result__header">
					<h3	className="search-result__name">{name}</h3>
					<input type="checkbox"
								 name="marker"
								 id={name}
								 data-term={term}
								 className="search-result__toggle search-result__toggle--marker"
								 checked={active}
					/>
					<mark className="search-result__rate" style={{backgroundColor: `${rating >= 4 ? "#00ff00" : rating >=3 ? "#ffff00" : "ff0000"}`}}>{rating}</mark>
				</header>
				<article className="search-result__content">
					<p className="search-result__distance">{`${Math.round(distance / 100)} meters`}</p>
					<a className="search-result__phone" href={`tel:${phone}`}>{display_phone}</a>
					<address className="search-result__address">{location.display_address[0]}</address>
				</article>
				<footer className="search-result__footer">
					<a className="search-result__link" href={url}>See more on Yelp...</a>
				</footer>
			</div>
		</article>
	)
}

export default SearchResult
