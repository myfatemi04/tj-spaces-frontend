import * as twilio from 'twilio-video';
import usePublications from '../../hooks/usePublications';
import useTrack from '../../hooks/useTrack';
import { ISpaceParticipant } from '../../typings/SpaceParticipant';
import SpaceParticipantCircle from './SpaceParticipantCircle';

export default function SpaceView2DRemoteParticipant({
	spacesParticipant,
	twilioParticipant
}: {
	spacesParticipant: ISpaceParticipant;
	twilioParticipant: twilio.Participant | null;
}) {
	const publications = usePublications(twilioParticipant);

	const audioTrackPublications = publications.filter(
		(publication) => publication.kind === 'audio'
	) as twilio.AudioTrackPublication[];

	const videoTrackPublications = publications.filter(
		(publication) => publication.kind === 'video'
	) as twilio.VideoTrackPublication[];

	const videoTrack = useTrack(videoTrackPublications[0]) as twilio.VideoTrack;

	return <SpaceParticipantCircle participant={spacesParticipant} videoTrack={videoTrack} isLocal={false} />;
}
