import prefix from '../prefix';

describe('prefix', () => {
	const styles = {
		test: 'foo',
		transform: 'foo'
	};
	const prefixed = prefix(styles);
	it('should return new copy if vendor keys found', () => {
		expect(prefixed).toBeDefined();
		expect(prefixed).not.toBe(styles);
	});

	it('should prefix vendor keys', () => {
		expect(prefixed).toEqual({
			test: 'foo',
			//todo: detect browser
			transform: 'foo',
			WebKitTransform: 'foo',
			MozTransform: 'foo',
			msTransform: 'foo',
			OTransform: 'foo'
		});
	});
});