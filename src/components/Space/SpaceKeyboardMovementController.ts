import { Updater } from 'queryshift';
import { useContext, useEffect } from 'react';
import useKeyboardState from '../../hooks/useKeyboardState';
import { ISpaceParticipant } from '../../typings/SpaceParticipant';
import SpaceConnectionContext from './SpaceConnectionContext';

export default function SpaceKeyboardMovementController() {
	const connection = useContext(SpaceConnectionContext);
	const keyboardState = useKeyboardState();

	useEffect(() => {
		let updater: Updater<ISpaceParticipant> = {
			$set: {
				rotatingDirection: keyboardState.a ? -1 : keyboardState.d ? 1 : 0,
				movingDirection: keyboardState.w ? 1 : keyboardState.s ? -1 : 0
			}
		};

		connection?.emit('update', updater);
	}, [connection, keyboardState]);
	return null;
}