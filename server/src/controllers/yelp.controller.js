import fetch from 'node-fetch'

export const yelp = {
	url: 'https://api.yelp.com/v3',
	clientID: 'PduF5ukaaCgs0GTq4PG8JQ',
	// Here's place for Yelp APIKey
	APIKey: 'ByytstaKQ5EfLQrjKNGMZa15_2OLjVyroGsIqpRnjjWovcqGBf3XrJ5s36ZNzf_Y_tpDLUOiRPeDFrQRpouRxa0K85ebVrgTrq7l0VPB-sQKHF_kaqrm9lCcuG1vW3Yx',
}


export function getCompanies(req, res) {
	const query = req.params.query
	fetch(`https://api.yelp.com/v3/businesses/search?${query}`, {
		headers: {
			Authorization: `Bearer ${yelp.APIKey}`
		}
	})
		.then(res => res.json())
		.then(data => {
			if(data.error) throw data
			res.send(data)
		})
		.catch(err => res.status(401).send(err))
}
