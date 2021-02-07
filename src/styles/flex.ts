import { createStylesheet } from './createStylesheet';

export const flexStyles = createStylesheet({
	row: {
		display: 'flex',
		flexDirection: 'row'
	},
	column: {
		display: 'flex',
		flexDirection: 'column'
	}
});

export const alignmentStyles = createStylesheet({
	center: { alignItems: 'center' },
	end: { alignItems: 'end' },
	start: { alignItems: 'start' }
});

export const justifyContentStyles = createStylesheet({
	center: { justifyContent: 'center' },
	start: { justifyContent: 'start' },
	end: { justifyContent: 'center' },
	spaceBetween: { justifyContent: 'space-between' }
});
