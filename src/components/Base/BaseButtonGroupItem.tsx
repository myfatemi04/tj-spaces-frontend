import { MouseEventHandler } from 'react';
import colors from '../../styles/colors';
import { stylex, ClassProvider, createStylesheet } from '../../styles/createStylesheet';

const baseButtonGroupItem = createStylesheet({
	base: {
		flex: 1,
		backgroundColor: '#404040',
		padding: '1rem',
		textAlign: 'center',
		cursor: 'pointer',
		subSelectors: {
			':first-child': {
				borderTopLeftRadius: '0.5em',
				borderBottomLeftRadius: '0.5em'
			},
			':last-child': {
				borderTopRightRadius: '0.5em',
				borderBottomRightRadius: '0.5em'
			}
		},
		transition: 'background-color 500ms ease'
	},
	selected: {
		backgroundColor: colors.red
	}
});

export default function BaseButtonGroupItem({
	children,
	classes,
	onClick
}: {
	children: React.ReactNode;
	classes?: ClassProvider | null | false;
	onClick: MouseEventHandler;
}) {
	return (
		<div className={stylex(baseButtonGroupItem.base, classes)} onClick={(event) => onClick(event)}>
			{children}
		</div>
	);
}