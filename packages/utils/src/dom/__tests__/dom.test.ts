import { getVendorProperty } from '../dom';

describe('getVendorProperty', () => {
	it('should return vendors proprty', () => {
		const vendorProperty = getVendorProperty('transform');
		const [webkit, moz, ms, o] = vendorProperty;

		expect(webkit).toEqual('WebKitTransform');
		expect(moz).toEqual('MozTransform');
		expect(ms).toEqual('msTransform');
		expect(o).toEqual('OTransform');
	});
});
