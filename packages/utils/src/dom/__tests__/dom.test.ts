import {
	getBoundingClientRect,
	style,
	getVendorProperty,
	setVendorStyle
} from '../dom';

beforeEach(() => {
	document.body.innerHTML = '<div id="element"></div>';
});

describe('getBoundingClientRect', () => {
	it('should return bounding client rect of given element', () => {
		const element: any = document.getElementById('element');
		element.getBoundingClientRect = jest.fn();

		element.getBoundingClientRect.mockReturnValue({
			bottom: 50,
			left: 100,
			right: 129,
			top: 20,
			width: 10,
			height: 50
		});

		const bounding = getBoundingClientRect(element);

		expect(bounding.bottom).toEqual(50);
		expect(bounding.left).toEqual(100);
		expect(bounding.right).toEqual(129);
		expect(bounding.top).toEqual(20);
		expect(bounding.width).toEqual(10);
		expect(bounding.height).toEqual(50);
		expect(bounding.middle).toEqual(105);
		expect(bounding.center).toEqual(45);
	});
});

describe('style', () => {
	it('should add styles from provided object to the element', () => {
		const element: any = document.getElementById('element');
		style(element, {
			height: '12px',
			width: '24px',
			'font-size': '12px'
		});

		const {height, width, 'font-size': fontSize} = element.style;

		expect(height).toEqual('12px');
		expect(width).toEqual('24px');
		expect(fontSize).toEqual('12px');
	});
});

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

describe('setVendorStyle', () => {
	it('should add style property to element with vendor prefixes.', () => {
		const element: any = document.getElementById('element');
		setVendorStyle(element, 'transform', 'testValue');

		const {WebKitTransform, MozTransform, msTransform, OTransform} = element.style;
		expect(WebKitTransform).toBeDefined();
		expect(MozTransform).toBeDefined();
		expect(msTransform).toBeDefined();
		expect(OTransform).toBeDefined();
	});
});