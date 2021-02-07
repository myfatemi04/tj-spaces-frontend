import { createStylesheet } from '../styles/createStylesheet';
import { Friend } from '../typings/Friend';
import BaseRow from './Base/BaseRow';
import BaseText from './Base/BaseText';
import BaseButton from './Base/BaseButton';

const styles = createStylesheet({
	picture: {
		flex: 1,
		borderRadius: '100%',
		width: '3rem'
	},
	bio: {
		flex: 5
	}
});

export default function AddFriendsListRow({
	friend,
	onClickedAddFriend,
	requested
}: {
	friend: Friend;
	onClickedAddFriend: () => void;
	requested: boolean;
}) {
	return (
		<BaseRow direction="row" alignment="center" spacing={1}>
			<img src={friend.picture} className={styles('picture')} alt={friend.name + "'s profile photo"} />
			<BaseRow direction="column" xstyle={styles.bio} alignment="center" justifyContent="center">
				<BaseText fontSize="medium" fontWeight="bold">
					{friend.name}
				</BaseText>
			</BaseRow>
			{!requested ? (
				<BaseButton onClick={() => onClickedAddFriend()}>Add Friend</BaseButton>
			) : (
				<BaseText>Request sent</BaseText>
			)}
		</BaseRow>
	);
}