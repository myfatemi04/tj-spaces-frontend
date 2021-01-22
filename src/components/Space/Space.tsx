import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as io from 'socket.io-client';
import * as twilio from 'twilio-video';
import useSpace from '../../hooks/useSpace';
import { API_SERVER_URL } from '../../lib/constants';
import getSessionId from '../../lib/getSessionId';
import { ISpaceParticipant } from '../../typings/SpaceParticipant';
import AuthContext from '../AuthContext/AuthContext';
import Button from '../Button/Button';
import CurrentSpaceContext from '../CurrentSpaceContext/CurrentSpaceContext';
import SpaceAudioContext from '../SpaceAudioContext/SpaceAudioContext';
import SpaceParticipantListing from '../SpaceParticipantListing/SpaceParticipantListing';
import SpaceParticipantLocal from '../SpaceParticipantLocal/SpaceParticipantLocal';
import SpaceParticipantRemote from '../SpaceParticipantRemote/SpaceParticipantRemote';
import Typography from '../Typography/Typography';

export default function Space({ id }: { id: string }) {
	const space = useSpace(id);
	const [participants, setParticipants] = useState(new Map<string, ISpaceParticipant>());
	const [twilioParticipants, setTwilioParticipants] = useState(new Map<string, twilio.RemoteParticipant>());
	const [localTwilioParticipant, setLocalTwilioParticipant] = useState<twilio.LocalParticipant>();
	const [twilioToken, setTwilioToken] = useState<string>();
	const [twilioRoom, setTwilioRoom] = useState<twilio.Room>();
	const [muted, setMuted_DO_NOT_USE_DIRECTLY] = useState<boolean>(false);
	const [cameraEnabled, setCameraEnabled_DO_NOT_USE_DIRECTLY] = useState<boolean>(true);
	const audioContext = useRef(new AudioContext());
	const { user } = useContext(AuthContext);

	// id
	useEffect(() => {
		const connection = io.connect(API_SERVER_URL + '?sessionId=' + getSessionId());
		connection.emit('join_space', id);

		connection.on('twilio_grant', (grant: string) => {
			setTwilioToken(grant);
		});

		connection.on('peers', (peers: { [id: string]: ISpaceParticipant }) => {
			let participants = new Map<string, ISpaceParticipant>();

			for (let [id, participant] of Object.entries(peers)) {
				participants.set(id, participant);
			}

			setParticipants(participants);
		});

		connection.on('peer_joined', (peer: ISpaceParticipant) => {
			setParticipants((participants) => {
				participants.set(peer.accountId, peer);
				return participants;
			});
		});

		connection.on('peer_left', (peer: ISpaceParticipant) => {
			setParticipants((participants) => {
				participants.delete(peer.accountId);
				return participants;
			});
		});

		return () => {
			connection.emit('leave_space');
			connection.off('peer_joined');
			connection.off('peer_left');
			connection.off('peers');
		};
	}, [id]);

	// twilioToken
	useEffect(() => {
		if (twilioToken) {
			twilio.connect(twilioToken, { video: { width: 1280 }, audio: true }).then((room) => {
				setTwilioRoom(room);
			});
		}
	}, [twilioToken]);

	// twilioRoom
	useEffect(() => {
		// We have a Twilio room
		if (twilioRoom) {
			setLocalTwilioParticipant(twilioRoom.localParticipant);

			// Add handlers for twilio connections
			/**
			 * @param participant The Twilio participant that joined
			 * @param _alreadyHere Whether the participant was here when we joined the room and we are adding them to the state via this function
			 */
			const participantConnected = (participant: twilio.RemoteParticipant, _alreadyHere: boolean = false) => {
				let participantId = participant.identity;
				setTwilioParticipants((participants) => {
					participants.set(participantId, participant);
					return participants;
				});
			};
			const participantDisconnected = (participant: twilio.RemoteParticipant) => {
				let participantId = participant.identity;
				setTwilioParticipants((participants) => {
					participants.delete(participantId);
					return participants;
				});
			};

			twilioRoom.on('participantConnected', participantConnected);
			twilioRoom.on('participantDisconnected', participantDisconnected);

			for (let participant of Array.from(twilioRoom.participants.values())) {
				participantConnected(participant, true);
			}

			// Don't forget to remove the handlers if we leave the room
			return () => {
				twilioRoom.off('participantConnected', participantConnected);
				twilioRoom.off('participantDisconnected', participantDisconnected);
				twilioRoom.disconnect();
			};
		}
	}, [twilioRoom]);

	const muteSelf = useCallback(() => {
		if (localTwilioParticipant) {
			localTwilioParticipant.audioTracks.forEach((localAudioTrack) => {
				localAudioTrack.track.disable();
			});

			setMuted_DO_NOT_USE_DIRECTLY(true);
		}
	}, [localTwilioParticipant]);

	const unmuteSelf = useCallback(() => {
		if (localTwilioParticipant) {
			localTwilioParticipant.audioTracks.forEach((localAudioTrack) => {
				localAudioTrack.track.enable();
			});

			setMuted_DO_NOT_USE_DIRECTLY(false);
		}
	}, [localTwilioParticipant]);

	const enableCamera = useCallback(() => {
		if (localTwilioParticipant) {
			localTwilioParticipant.videoTracks.forEach((localVideoTrack) => {
				localVideoTrack.track.enable();
			});

			setCameraEnabled_DO_NOT_USE_DIRECTLY(true);
		}
	}, [localTwilioParticipant]);

	const disableCamera = useCallback(() => {
		if (localTwilioParticipant) {
			localTwilioParticipant.videoTracks.forEach((localVideoTrack) => {
				localVideoTrack.track.disable();
			});

			setCameraEnabled_DO_NOT_USE_DIRECTLY(false);
		}
	}, [localTwilioParticipant]);

	return (
		<CurrentSpaceContext.Provider value={id}>
			<SpaceAudioContext.Provider value={audioContext.current}>
				{space ? (
					<div style={{ height: '100vh' }} className="flex-column padding-2 position-relative">
						<Typography type="title" alignment="center">
							{space.name}
						</Typography>
						<br />

						<div className="text-center">
							<h2>Here</h2>
							{Array.from(participants.values()).map((participant) => (
								<SpaceParticipantListing participant={participant} key={participant.accountId} />
							))}
						</div>

						<div
							className="position-absolute"
							style={{ left: '0px', top: '0px', width: '100%', height: '100%', zIndex: -1 }}
						>
							{participants.size && (
								<>
									<SpaceParticipantLocal
										spacesParticipant={participants.get(user?.id!)!}
										twilioParticipant={localTwilioParticipant!}
									/>
									{Array.from(twilioParticipants.entries()).map(([id, participant]) => (
										<SpaceParticipantRemote
											twilioParticipant={participant}
											spacesParticipant={participants.get(id)!}
										/>
									))}
								</>
							)}
						</div>

						<div className="flex-row">
							<Button to=".." className="row-item">
								Leave
							</Button>

							{muted ? (
								<Button onClick={() => unmuteSelf()} className="row-item">
									<i className="fas fa-microphone-slash"></i>
								</Button>
							) : (
								<Button onClick={() => muteSelf()} className="row-item">
									<i className="fas fa-microphone"></i>
								</Button>
							)}

							{cameraEnabled ? (
								<Button onClick={() => disableCamera()} className="row-item">
									<i className="fas fa-video"></i>
								</Button>
							) : (
								<Button onClick={() => enableCamera()} className="row-item">
									<i className="fas fa-video-slash"></i>
								</Button>
							)}
						</div>
					</div>
				) : (
					<span>Loading...</span>
				)}
			</SpaceAudioContext.Provider>
		</CurrentSpaceContext.Provider>
	);
}
