import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { createStylesheet } from '../../styles/createStylesheet';
import SpaceFeedWrapper from './SpaceFeedWrapper';

export const styles = createStylesheet({
	container: {
		display: 'flex',
		flexDirection: 'row',
		width: '100vw',
		height: '100vh'
	}
});

export default function HomePage() {
	document.title = 'Home';

	return (
		<div className={styles.container}>
			<Sidebar />
			<SpaceFeedWrapper />
		</div>
	);
}
