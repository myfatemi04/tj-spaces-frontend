import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import useLocalParticipant from '../../../hooks/useLocalParticipant';
import getRootFontSize from '../../../lib/getRootFontSize';
import colors from '../../../styles/colors';
import { createStylesheet } from '../../../styles/createStylesheet';
import SpaceMediaContext from '../SpaceMediaContext';
import SpaceViewTilesLocalParticipant from './SpaceViewTilesLocalParticipant';
import SpaceViewTilesTileRow from './SpaceViewTilesTileRow';
import SpaceViewTilesRemoteParticipant from './SpaceViewTilesRemoteParticipant';
import { spaceViewStyles } from '../SpaceViewStyles';
import useSpaceParticipants from '../../../hooks/useSpaceParticipants';
import SpaceViewLayoutContext from '../SpaceViewLayoutContext';

export const styles = createStylesheet({
	screen: {
		extends: [spaceViewStyles.view],
		overflow: 'auto',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
	}
});

export default function SpaceViewTiles() {
	const me = useLocalParticipant();
	const participants = useSpaceParticipants();
	const { twilioParticipants } = useContext(SpaceMediaContext) ?? {};
	const [maxParticipantsPerRow, setMaxParticipantsPerRow] = useState(5);
	const screenRef = useRef<HTMLDivElement | null>(null);
	const layout = useContext(SpaceViewLayoutContext);

	useLayoutEffect(() => {
		const rootFontSize = getRootFontSize();
		const spaceParticipantCircleSize = layout.expanded ? 10 * rootFontSize : 7.5 * rootFontSize; // 10 rem
		const columnGap = 2 * rootFontSize; // 1 rem
		const width = screenRef.current?.clientWidth ?? window.innerWidth * 0.5;
		const maxParticipantsPerRow = Math.floor(width / (spaceParticipantCircleSize + columnGap));

		setMaxParticipantsPerRow(maxParticipantsPerRow);
		return () => {};
	}, [layout.expanded, participants]);

	if (me == null) {
		return <h1>Joining Space</h1>;
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
			const twilioParticipant = twilioParticipants?.[participant.accountId];
			const isLocal = participant.accountId === me.accountId;
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
		})
	];

	let blocks = [];

	for (let i = 0; i < participantElements.length; i += maxParticipantsPerRow) {
		blocks.push(participantElements.slice(i, i + maxParticipantsPerRow));
	}

	return (
		<div className={styles.screen} style={{ backgroundColor: colors.white }} ref={screenRef}>
			{blocks.map((block, idx) => {
				return <SpaceViewTilesTileRow participants={block} key={idx} />;
			})}
		</div>
	);
}