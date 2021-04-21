import useSDKState from '../../hooks/useSDKState';
import ChatContext from './ChatContext';
import ChatSDK from './ChatSDK';

export function ChatProvider({
	chatSDK,
	children,
}: {
	chatSDK: ChatSDK;
	children: React.ReactNode;
}) {
	const chatState = useSDKState(chatSDK);

	return (
		<ChatContext.Provider value={{chatSDK, chatState}}>
			{children}
		</ChatContext.Provider>
	);
}
