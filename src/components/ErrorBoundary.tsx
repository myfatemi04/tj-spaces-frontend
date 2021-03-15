/*
  Copyright (C) Michael Fatemi - All Rights Reserved.
  Unauthorized copying of this file via any medium is strictly prohibited.
  Proprietary and confidential.
  Written by Michael Fatemi <myfatemi04@gmail.com>, February 2021.
*/
import React from 'react';
import {reportError} from '../api/analytics';
import Fullscreen from './base/BaseFullscreen';

export default class ErrorBoundary extends React.Component {
	state = {
		error: null,
	};
	static getDerivedStateFromError(error: any) {
		return {error};
	}
	componentDidMount() {
		window.onunhandledrejection = (error: any) => this.setState({error});
	}
	componentDidCatch(error: any) {
		console.error('Error:', error);
	}
	componentDidUpdate() {
		if (this.state.error) {
			reportError(this.state.error);
		}
	}
	render() {
		if (this.state.error) {
			return (
				<Fullscreen>
					<h1>There's been an error</h1>
					<p>
						Our developers are working to fix it as soon as possible! Send us an
						email at dev@dev.net if the error persists.
					</p>
				</Fullscreen>
			);
		} else {
			return this.props.children;
		}
	}
}
