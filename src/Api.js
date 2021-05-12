// change this to your api url
// app adjusted for handling v2 response
const apiUrl = 'https://localhost:44389/api/v2/BerrasGeoApp'

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
	console.log(msg)
}
