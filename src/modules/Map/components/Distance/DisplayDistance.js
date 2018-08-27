import React from 'react'
import './DisplayDistance.css'
import Loader from '../../../../components/Loader/Loader'

const DisplayDistance = ({origin, addresses, destinations, loading, itemLoading}) => {
	if(loading) return <Loader/>
	return (
		<div className="position">
			<h1 className="position__origin">Your location: {origin}</h1>
			<div className="position__distances">
				{addresses.map((address, idx) => {
					return (
						<div key={address+idx} className="distances__distance distance">
							<h5 className="distance__address">{address}</h5>
							<time className="distance__duration">{destinations[idx].duration.text}</time>
						</div>
					)
				})}
				 {itemLoading && <Loader/>}
			</div>
		</div>
	)
}

export default DisplayDistance
