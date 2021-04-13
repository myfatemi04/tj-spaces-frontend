/*
  Copyright (C) Michael Fatemi - All Rights Reserved.
  Unauthorized copying of this file via any medium is strictly prohibited.
  Proprietary and confidential.
  Written by Michael Fatemi <myfatemi04@gmail.com>, February 2021.
*/
import {useContext, useEffect, useState} from 'react';
import {useThree} from 'react-three-fiber';
import * as THREE from 'three';
import {useTracks} from '../../mediautil/MediaConnector';
import {Position} from '../../typings/Space';
import PointOfViewContext from './PointOfViewContext';
import SpaceVoiceContext from './VoiceContext';

export default function UserModel({
	position,
	rotation = 0,
	me,
	id,
}: {
	position: Position;
	rotation: number;
	me: boolean;
	id: string;
}) {
	const {camera} = useThree();
	const [videoElement] = useState(() => document.createElement('video'));
	const voiceServer = useContext(SpaceVoiceContext);
	const allTracks = useTracks(voiceServer, id);
	const videoTracks = (allTracks ?? []).filter(
		(track) => track.kind === 'video'
	);
	const pov = useContext(PointOfViewContext);

	// Camera positioning
	useEffect(() => {
		if (me) {
			if (pov === 'third-person') {
				let offset = {
					x: Math.sin(rotation),
					z: Math.cos(rotation),
				};
				camera.position.set(
					position.x + offset.x * 2,
					position.y + 4,
					position.z + offset.z * 6
				);
				camera.rotation.set(-Math.PI / 8, rotation, 0);
			} else {
				camera.position.set(position.x, position.y + 2, position.z);
			}
		}
	}, [camera, camera.position, me, position, pov, rotation]);

	// Video element
	useEffect(() => {
		if (videoElement) {
			if (videoTracks.length > 0) {
				if (!videoElement.srcObject) {
					const stream = new MediaStream(videoTracks);
					// videoElement.muted = false;
					videoElement.srcObject = stream;
					if (videoElement.paused) {
						videoElement.play();
					}
				} else {
					let obj = videoElement.srcObject as MediaStream;
					// Clear the current tracks
					obj.getTracks().forEach((track) => {
						obj.removeTrack(track);
					});
					// Add the new tracks
					for (let track of videoTracks) {
						obj.addTrack(track);
					}
				}
			}
		}
	}, [videoElement, videoTracks]);

	return (
		<mesh
			position={[position.x, position.y + 2, position.z]}
			// Vertical rotations must be made along the Z axis, because we rotate by pi/2 on the X axis.
			rotation={[0, 0, rotation ?? 0]}
		>
			{/* <cylinderBufferGeometry attach="geometry" args={[0.5, 0.5, 0.125, 64]} /> */}
			<planeBufferGeometry attach="geometry" args={[1, 1]} />
			{
				// Don't display my own avatar if in first person
				!(me && pov === 'first-person') && (
					<meshBasicMaterial
						attach="material"
						// color={me ? '#ff6666' : '#66ff66'}
						side={THREE.DoubleSide}
						flatShading
					>
						<videoTexture
							attach="map"
							args={[videoElement]}
							wrapS={THREE.RepeatWrapping}
							wrapT={THREE.RepeatWrapping}
						/>
					</meshBasicMaterial>
				)
			}
		</mesh>
	);
}
