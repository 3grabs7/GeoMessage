import './index.css'
import * as React from 'react'
import { useState, useEffect } from 'react'
import ReactMapGL, { FlyToInterpolator, Marker, Popup } from 'react-map-gl'
import { getGeoMessages, postGeoMessage } from './Api'
const d3 = require('d3-ease')

const App = () => {
	// pub token, no prob
	const mapBoxToken =
		'pk.eyJ1IjoiZ3JhYnMiLCJhIjoiY2tvbG83emk2MDQ1MTJuczNkY3gxNTR2dyJ9.ZcARgb7K_cpbAfje7C0OJA'
	// create custom styles -> https://studio.mapbox.com/
	const customMapStyle = 'mapbox://styles/grabs/ckolpkpoh0kah18nygzt0sll0'

	const [geoMessages, setGeoMessages] = useState([])
	const [showPopup, setShowPopup] = useState({})
	const [newGeoMessageForm, setNewGeoMessageForm] = useState(null)
	const [viewport, setViewport] = useState({
		width: '100vw',
		height: '100vh',
		longitude: 11.973121772083903,
		latitude: 57.70866192954713,
		zoom: 5,
	})

	// when component is loaded, call api to load all messages
	useEffect(
		() => {
			// uncomfortable code cause hooks don't allow async
			;(async () => {
				const geoMessages = await getGeoMessages()
				setGeoMessages(geoMessages)
			})()
		},
		[
			/* Will new entry reload and update? use state goes here*/
		]
	)

	// methods for setting predefined map destinations
	const goToGothenburg = () => {
		setViewport({
			...viewport,
			longitude: 11.973121772083903,
			latitude: 57.70866192954713,
			zoom: 11,
			transitionDuration: 4000,
			transitionInterpolator: new FlyToInterpolator(),
			transitionEasing: d3.easeCubic,
		})
	}
	const goToHalmstad = () => {
		setViewport({
			...viewport,
			longitude: 12.85961887706738,
			latitude: 56.67173391979142,
			zoom: 11,
			transitionDuration: 4000,
			transitionInterpolator: new FlyToInterpolator(),
			transitionEasing: d3.easeCubic,
		})
	}

	// sets new geo messages lon / lat when map is double clicked
	// form gets displayed
	const showNewGeoMessageForm = (e) => {
		setNewGeoMessageForm({
			longitude: e.lngLat[0],
			latitude: e.lngLat[1],
		})
	}

	// post to api when form is submitted
	const submitNewGeoMessage = () => {
		postGeoMessage(newGeoMessageForm)
	}

	return (
		<div>
			<button onClick={goToGothenburg}>Gothenburg</button>
			<button onClick={goToHalmstad}>Halmstad</button>
			{/* Load map */}
			<ReactMapGL
				{...viewport}
				mapStyle={customMapStyle}
				mapboxApiAccessToken={mapBoxToken}
				onViewportChange={(nextViewport) => setViewport(nextViewport)}
				onDblClick={showNewGeoMessageForm}
			>
				{/* map through object from api */}
				{geoMessages.map((msg, index) => (
					<div key={index}>
						{/* create markers for each message */}
						<Marker latitude={msg.latitude} longitude={msg.longitude}>
							<div
								onClick={() =>
									setShowPopup({
										...showPopup,
										[index]: true,
									})
								}
							>
								<img
									className='pin'
									style={{
										width: `${4 * viewport.zoom}px`,
										height: `${4 * viewport.zoom}px`,
									}}
									src='https://i.imgur.com/y0G5YTX.png'
									alt='pin'
								/>
							</div>
						</Marker>
						{/* create popups for each message */}
						{showPopup[index] ? (
							<Popup
								latitude={msg.latitude}
								longitude={msg.longitude}
								dynamicPosition={true}
								closeButton={true}
								closeOnClick={true}
								tipSize={20}
								onClose={() =>
									setShowPopup({
										...showPopup,
										[index]: false,
									})
								}
								anchor='top'
							>
								<div>
									<h4>{msg.message.title}</h4>
									<p>{`Author: ${msg.message.author}`}</p>
									<p>{msg.message.body}</p>
								</div>
							</Popup>
						) : null}
					</div>
				))}
				{/* show popup when map is double clicked
             and lon/lat is set for 'newGeoMessageForm'*/}
				{newGeoMessageForm ? (
					<div>
						<Popup
							latitude={newGeoMessageForm.latitude}
							longitude={newGeoMessageForm.longitude}
							dynamicPosition={true}
							closeButton={true}
							closeOnClick={false}
							tipSize={20}
							onClose={() => setNewGeoMessageForm(null)}
							anchor='top'
						>
							<div>
								<h4>New Message</h4>
								<div>
									<input
										type='text'
										placeholder='Title'
										onChange={(event) =>
											setNewGeoMessageForm({
												...newGeoMessageForm,
												title: event.target.value,
											})
										}
									/>
									<br />
									<input
										type='text'
										placeholder='Message'
										onChange={(event) =>
											setNewGeoMessageForm({
												...newGeoMessageForm,
												message: event.target.value,
											})
										}
									/>
									<br />
									<button
										onClick={() => {
											submitNewGeoMessage()
											setNewGeoMessageForm(null)
										}}
									>
										Post
									</button>
								</div>
							</div>
						</Popup>
					</div>
				) : null}
			</ReactMapGL>
		</div>
	)
}

export default App
