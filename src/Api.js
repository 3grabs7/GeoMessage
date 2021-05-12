let base64 = require('base-64')
// change this to your api url
// app adjusted for handling v2 response
const apiUrl = 'https://localhost:44389/api/v2/BerrasGeoApp'
const username = 'DemoUser'
const password = 'Passw0rd!#'

export async function getGeoMessages() {
	const response = await fetch(`${apiUrl}/Get`)
	return await response.json()
}

export async function postGeoMessage(geoMessage) {
	const msg = {
		title: geoMessage.title,
		body: geoMessage.message,
		longitude: geoMessage.longitude,
		latitude: geoMessage.latitude,
	}

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${base64.encode(`${username}:${password}`)}`,
		},
		body: JSON.stringify(msg),
		redirect: 'follow',
	}

	const response = await fetch(`${apiUrl}/Post`, requestOptions)
	return await response.json()
}
