import React, { useContext } from 'react';
import SpaceMediaContext from '../SpaceMediaContext';
import { VideoTrack } from 'twilio-video';
import { spaceViewStyles } from '../SpaceViewStyles';
import SpaceParticipantCircle from '../SpaceParticipantCircle';
import { ISpaceParticipant } from '../../../typings/SpaceParticipant';
import SpaceParticipant from '../SpaceParticipant';

/**
 * A /local/ Spaces participant. Updates the AudioContext listener position when it moves.
 * @param twilioParticipant The twilio-video library participant (includes MediaStreamTracks)
 * @param spacesParticipant The Spaces participant (includes location, displayName, etc)
 */
export default function SpaceBottomLocalVideo({ participant }: { participant: ISpaceParticipant }) {
	const mediaContext = useContext(SpaceMediaContext);
	const localVideoTrack = mediaContext?.localVideoTrack ?? null;

	return (
		<div className={spaceViewStyles.bottomLocalVideo}>
			<SpaceParticipantCircle isLocal>
				<SpaceParticipant participant={participant} videoTrack={localVideoTrack as VideoTrack} />
			</SpaceParticipantCircle>
		</div>
	);
}