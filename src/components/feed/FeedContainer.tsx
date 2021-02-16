import {useEffect, useState} from 'react';
import {getSuggestedSpaces} from '../../api/spaces';
import {FetchStatus} from '../../api/FetchStatus';
import {Space} from '../../typings/Space';
import Awaiting from '../Awaiting';
import Feed from './Feed';

/**
 * Wrapper component that fetches data for the feed and renders it.
 */
export default function FeedContainer() {
	const [spaces, setSpaces] = useState<Space[]>([]);
	const [fetchStatus, setFetchStatus] = useState<FetchStatus>(null);

	useEffect(() => {
		setFetchStatus('loading');
		getSuggestedSpaces()
			.then((spaces) => {
				setSpaces(spaces);
				setFetchStatus('loaded');
			})
			.catch((error) => setFetchStatus('errored'));
	}, []);

	return (
		<Awaiting fetchStatus={fetchStatus}>
			<Feed spaces={spaces} />
		</Awaiting>
	);
}
