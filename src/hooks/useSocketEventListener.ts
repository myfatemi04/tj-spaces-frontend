import { useEffect } from 'react';

export default function useSocketEventListener(
	io: SocketIOClient.Socket,
	event: string,
	callback: (...args: any[]) => void
) {
	useEffect(() => {
		io.on(event, callback);
		return () => {
			io.off(event, callback);
		};
	}, [callback, event, io]);
}