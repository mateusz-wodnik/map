import React from 'react';
import './Search.css'

const Search = ({handleSearch}) => (
	<form className="search" onSubmit={handleSearch}>
		<input className="search__term" name="term" type="text" placeholder="Write something to find places"/>
		<button className="search__submit" type="submit">search</button>
	</form>
)

export default Search
