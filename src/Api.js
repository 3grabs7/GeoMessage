// change this to your url
const apiUrl = 'https://localhost:44389/api/v2/BerrasGeoApp'

export async function getGeoComments() {
	const response = await fetch(`${apiUrl}/Get`)
	return await response.json()
}
