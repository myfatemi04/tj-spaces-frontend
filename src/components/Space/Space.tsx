import React, {useContext, useEffect, useRef, useState} from 'react';
import {connect} from 'twilio-video';
import {useSpace} from '../../api/spaces';
import joinSpace from '../../space/joinSpace';
import AuthContext from '../AuthContext';
import BaseButton from '../base/BaseButton';
import BaseRow from '../base/BaseRow';
import BaseText from '../base/BaseText';
import ChatModal from './chatModal/ChatModal';
import SpaceDeviceControlButtons from './SpaceDeviceControlButtons';
import SpaceManager from './SpaceManager';
import SpaceManagerContext from './SpaceManagerContext';
import SpaceView3D from './spaceView3D/SpaceView3D';
import {spaceViewStyles} from './SpaceViewStyles';
import SpaceViewTiles from './spaceViewTiles/SpaceViewTiles';

const SPACE_VIEW_TYPE: 'pixel' | '3d' = 'pixel';

export default function Space({id}: {id: string}) {
	const connectionRef = useRef<WebSocket>();
	const managerRef = useRef<SpaceManager>(new SpaceManager(id));
	const space = useSpace(id);

	const {user} = useContext(AuthContext);
	const [chatModalOpen, setChatModalOpen] = useState(false);

	useEffect(() => {
		(async () => {
			const {connection, twilioGrant} = await joinSpace(id);
			connectionRef.current = connection;
			managerRef.current.setWebsocket(connection);
			connect(twilioGrant).then((room) => managerRef.current.setRoom(room));
		})();
	}, [id]);

	if (user == null) {
		return <h1>Authenticating</h1>;
	}

	return (
		<SpaceManagerContext.Provider value={managerRef.current}>
			<div className={spaceViewStyles('container')}>
				<div className={spaceViewStyles('topHeading')}>
					<BaseText variant="secondary-title" alignment="center">
						{space ? space.name : 'Loading Space'}
					</BaseText>
				</div>

				<canvas ref={(ref) => ref && managerRef.current.setCanvas(ref)} />

				{/* <SpaceViewTiles /> */}

				<BaseRow
					direction="row"
					justifyContent="center"
					alignment="center"
					spacing={1}
					rails={2}
					xstyle={spaceViewStyles.bottomButtons}
				>
					<BaseButton onClick={() => setChatModalOpen(true)}>Chat</BaseButton>

					{chatModalOpen && (
						<ChatModal onClose={() => setChatModalOpen(false)} />
					)}

					<BaseButton to="..">Leave</BaseButton>

					<SpaceDeviceControlButtons />
				</BaseRow>
			</div>
		</SpaceManagerContext.Provider>
	);
}
