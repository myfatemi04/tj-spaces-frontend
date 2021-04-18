/*
  Copyright (C) Michael Fatemi - All Rights Reserved.
  Unauthorized copying of this file via any medium is strictly prohibited.
  Proprietary and confidential.
  Written by Michael Fatemi <myfatemi04@gmail.com>, February 2021.
*/
import {PointerLockControls} from '@react-three/drei';
import {Suspense, useContext, useEffect, useRef} from 'react';
import {Canvas, useLoader} from 'react-three-fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import useKeyboardState from '../../hooks/useKeyboardState';
import useMyID from '../../hooks/useMyID';
import useParticipants from '../../hooks/useParticipants';
import SpatialAudioListener from '../../media/SpatialAudioListener';
import AuthContext from '../AuthContext';
import Floor from './Floor';
import LocalWebcamContext from './LocalWebcamContext';
import PointOfViewContext from './PointOfViewContext';
import RemoteAudio from './RemoteAudio';
import SimulationServerContext from './SimulationServerContext';
import SpaceAudioContext from './SpaceAudioContext';
import UserModel from './UserModel';
import SpaceVoiceContext from './VoiceContext';

function SushiTable() {
	// Attribution: Aimi Sekiguchi
	// https://poly.google.com/user/c6UmSrlqUaJ/
	// TODO: Put attribution on page itself for actual release
	// (Only developers see it right now so the attribution is in the code)
	const table = useLoader(
		GLTFLoader,
		'https://nebulamodels.s3.amazonaws.com/models/sushi_table/model.gltf'
	);
	return (
		<primitive object={table.scene} scale={[2, 2, 2]} position={[0, -1.9, 0]} />
	);
}

export default function Space() {
	const manager = useContext(SimulationServerContext);

	const myID = useMyID();
	const participants = useParticipants();

	const {a = false, s = false, d = false, w = false} = useKeyboardState(
		document.body
	);
	const rotation = useRef<number>(0);

	useEffect(() => {
		// console.log(rotation.current);

		// A and D move left and right (-X and +X)
		// W and S move forward and backward (-Z and +Z)

		// Take this vector and rotate it by `rotation.current` degrees.

		let relativeX = -a + +d;
		let relativeZ = -s + +w;

		let dx =
			relativeX * Math.cos(rotation.current) -
			relativeZ * Math.sin(rotation.current);

		let dz =
			relativeX * Math.sin(rotation.current) +
			relativeZ * Math.cos(rotation.current);

		manager.setMoveDirection({
			x: dx,
			y: 0,
			z: -dz,
		});
	}, [a, s, d, w, manager]);

	const myPosition = myID ? participants[myID]?.position : undefined;

	// Because 'Canvas' creates a new React renderer, contexts cannot be shared, unfortunately
	// So we need to pass them in manually
	const auth = useContext(AuthContext);
	const simulation = useContext(SimulationServerContext);
	const userMedia = useContext(LocalWebcamContext);
	const audio = useContext(SpaceAudioContext);
	const voice = useContext(SpaceVoiceContext);

	return (
		<div style={{width: '100vw', height: '100vh'}}>
			<SpatialAudioListener
				position={myPosition ?? {x: 0, y: 0, z: 0}}
				rotation={0}
			/>
			{Object.entries(participants).map(([id, participant]) =>
				id !== myID ? (
					<RemoteAudio userID={id} position={participant.position} key={id} />
				) : null
			)}
			<Canvas>
				<AuthContext.Provider value={auth}>
					<SimulationServerContext.Provider value={simulation}>
						<LocalWebcamContext.Provider value={userMedia}>
							<SpaceAudioContext.Provider value={audio ?? null}>
								<SpaceVoiceContext.Provider value={voice ?? null}>
									<PointOfViewContext.Provider value="first-person">
										<PointerLockControls
											onUpdate={(controls) =>
												(rotation.current = controls.getObject().rotation.z)
											}
										/>
										<Suspense fallback="Loading model">
											<SushiTable />
										</Suspense>
										<ambientLight intensity={0.5} />
										<Floor />
										{Object.entries(participants).map(([id, participant]) => (
											<UserModel
												position={participant.position}
												rotation={participant.rotation}
												key={id}
												me={id === myID}
												id={id}
											/>
										))}
									</PointOfViewContext.Provider>
								</SpaceVoiceContext.Provider>
							</SpaceAudioContext.Provider>
						</LocalWebcamContext.Provider>
					</SimulationServerContext.Provider>
				</AuthContext.Provider>
			</Canvas>
		</div>
	);
}
