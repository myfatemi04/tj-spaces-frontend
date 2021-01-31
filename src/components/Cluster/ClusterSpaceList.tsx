import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { createStylesheet } from '../../styles/createStylesheet';
import hoverableLightBox from '../../styles/hoverableLightBox';
import spacing from '../../styles/spacing';
import { ISpace } from '../../typings/Space';
import BaseRow from '../Base/BaseRow';
import SpaceCreateButton from './ClusterSpaceCreateButton';
import ClusterIDContext from './CurrentClusterContext';

const styles = createStylesheet({
	spaceOnlineCount: {
		fontSize: '0.75rem',
		textTransform: 'uppercase',
		color: 'var(--spaces-color-light-1)'
	},
	spaceListItem: {
		extends: [hoverableLightBox.hoverableLightBox, spacing.columnItem],
		height: '5em',
		fontSize: '1.25em'
	}
});

export function SpaceListItem({ clusterId, space }: { clusterId: string; space: ISpace }) {
	return (
		<div className={styles.spaceListItem}>
			<b>
				<Link to={`/clusters/${clusterId}/spaces/${space.id}`} className="unstyled-link">
					{space.name}
				</Link>
			</b>
			<br />
			<b className={styles.spaceOnlineCount}>Online: {space.online_count}</b>
		</div>
	);
}

export default function SpaceList({ spaces = [] }: { spaces?: ISpace[] }) {
	const cluster = useContext(ClusterIDContext);

	return (
		<BaseRow direction="column" spacing={1}>
			{spaces.map((space) => (
				<SpaceListItem clusterId={cluster.id!} space={space} key={space.id} />
			))}

			<SpaceCreateButton />
		</BaseRow>
	);
}