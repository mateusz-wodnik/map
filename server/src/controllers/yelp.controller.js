import fetch from 'node-fetch'

export const yelp = {
	url: 'https://api.yelp.com/v3',
	clientID: 'PduF5ukaaCgs0GTq4PG8JQ',
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
		.then(data => res.send(data))
		.catch(err => res.send(err))
}
