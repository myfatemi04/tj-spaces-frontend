import { useContext, useEffect, useRef } from 'react';
import * as twilio from 'twilio-video';
import useTracks from '../../hooks/useTracks';
import { ISpaceParticipant } from '../../typings/SpaceParticipant';
import SpaceAudioContext from '../SpaceAudioContext/SpaceAudioContext';
import { defaultPannerNodeSettings } from '../SpatialAudio/SpatialAudio';

export default function SpaceParticipantRemote({
	twilioParticipant,
	spacesParticipant
}: {
	twilioParticipant: twilio.Participant;
	spacesParticipant: ISpaceParticipant;
}) {
	const { audioTrack } = useTracks(twilioParticipant);
	const audioContext = useContext(SpaceAudioContext);
	const pannerNode = useRef<PannerNode>();
	const {
		position: { location, rotation }
	} = spacesParticipant;

	// [audioContext, audioTrack]
	useEffect(() => {
		if (audioTrack) {
			let audioSource = audioContext.createMediaStreamTrackSource(audioTrack);
			pannerNode.current = new PannerNode(audioContext, defaultPannerNodeSettings);
			audioSource.connect(pannerNode.current).connect(audioContext.destination);

			return () => {
				audioSource.disconnect();
				pannerNode.current = undefined;
			};
		}
	}, [audioContext, audioTrack]);

	// [location, rotation]
	useEffect(() => {
		if (pannerNode.current) {
			pannerNode.current.positionX.value = location.x;
			pannerNode.current.positionY.value = location.y;

			pannerNode.current.orientationX.value = Math.sin(rotation);
			pannerNode.current.orientationZ.value = Math.cos(rotation);
		}
	}, [location, rotation]);

	return null;
}
