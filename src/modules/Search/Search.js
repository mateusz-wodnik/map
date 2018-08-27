import React from 'react';
import './Search.css'

const Search = ({handleSearch, loading, error}) => (
	<form className="search" onSubmit={(e) => {
		e.preventDefault()
		handleSearch(e)
	}}>
		<input className="search__term"
					 name="term"
					 type="text"
					 placeholder={error ? error.description : "Search for places"}
					 disabled={loading}
					 style={{opacity: `${loading ? 0.8 : 1}`}}
		/>
		<button className="search__submit" type="submit">
			<span className={`search__icon ${loading ? 'search__icon search__submit--loading' : ''}`}>⌕</span>
		</button>
	</form>
)

export default Search
