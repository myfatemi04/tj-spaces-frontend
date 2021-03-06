import React, {useContext, useLayoutEffect, useRef, useState} from 'react';
import useLocalParticipant from '../../../hooks/useLocalParticipant';
import getRootFontSize from '../../../lib/getRootFontSize';
import {createStylesheet} from '../../../styles/createStylesheet';
import SpaceMediaContext from '../SpaceMediaContext';
import SpaceParticipantsContext from '../SpaceParticipantsContext';
import {spaceViewStyles} from '../SpaceViewStyles';
import SpaceViewTilesLocalParticipant from './SpaceViewTilesLocalParticipant';
import SpaceViewTilesRemoteParticipant from './SpaceViewTilesRemoteParticipant';
import SpaceViewTilesTileRow from './SpaceViewTilesTileRow';

export const styles = createStylesheet({
	screen: {
		extends: [spaceViewStyles.environment],
		overflow: 'auto',

		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: 'white',
	},
});

export default function SpaceViewTiles() {
	const me = useLocalParticipant();
	const participants = useContext(SpaceParticipantsContext);
	const {twilioParticipants} = useContext(SpaceMediaContext) ?? {};
	const [maxParticipantsPerRow, setMaxParticipantsPerRow] = useState(5);
	const screenRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		const rootFontSize = getRootFontSize();
		const spaceParticipantCircleSize = 10 * rootFontSize;
		const columnGap = 2 * rootFontSize; // 1 rem
		const width = screenRef.current?.clientWidth ?? window.innerWidth * 0.5;
		const maxParticipantsPerRow = Math.floor(
			width / (spaceParticipantCircleSize + columnGap)
		);

		setMaxParticipantsPerRow(maxParticipantsPerRow);
		return () => {};
	}, [participants]);

	if (me == null) {
		return <h1>Joining Space [ME]</h1>;
	}

	let participantElements = [
		<SpaceViewTilesLocalParticipant />,
		<SpaceViewTilesLocalParticipant />,
		<SpaceViewTilesLocalParticipant />,
		<SpaceViewTilesLocalParticipant />,
		<SpaceViewTilesLocalParticipant />,
		<SpaceViewTilesLocalParticipant />,
		<SpaceViewTilesLocalParticipant />,
		<SpaceViewTilesLocalParticipant />,
		<SpaceViewTilesLocalParticipant />,
		<SpaceViewTilesLocalParticipant />,
		<SpaceViewTilesLocalParticipant />,
		...Object.values(participants).map((participant) => {
			const twilioParticipant = twilioParticipants?.[participant.id];
			const isLocal = participant.id === me.id;
			if (!isLocal) {
				return (
					<SpaceViewTilesRemoteParticipant
						twilioParticipant={twilioParticipant ?? null}
						spacesParticipant={participant}
					/>
				);
			} else {
				return null;
			}
		}),
	];

	let blocks = [];

	for (let i = 0; i < participantElements.length; i += maxParticipantsPerRow) {
		blocks.push(participantElements.slice(i, i + maxParticipantsPerRow));
	}

	return (
		<div className={styles('screen')} ref={screenRef}>
			{blocks.map((block, idx) => {
				return <SpaceViewTilesTileRow participants={block} key={idx} />;
			})}
		</div>
	);
}