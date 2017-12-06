import { default as bem, block, element, modifier, BEM } from '../bem';

/*eslint-disable object-curly-newline,object-property-newline,no-undefined*/

describe('bem', () => {
	describe('block', () => {
		it('should generate block className', () => {
			expect(block('foo')).toBe('foo');
		});
		it('should create block className with modifiers', () => {
			expect(block('foo', ['m1', {m2: true, m3: false}])).toBe('foo foo-m1 foo-m2');
		});
		it('should ignore null and undefined as modifiers', () => {
			expect(block('foo', null)).toBe('foo');
			expect(block('foo', undefined)).toBe('foo');
		});
		it('should operate complex nested modifiers', () => {
			expect(block.bind(null, 'foo', ['1', {a: '2'}, [3, {b: '4'}]])).not.toThrow();
		});
	});

	describe('element', () => {
		it('should generate element className', () => {
			expect(element('foo', 'bar')).toBe('foo--bar');
		});
		it('should generate element className with modifiers', () => {
			expect(element('foo', 'bar', ['m'])).toBe('foo--bar foo--bar-m');
		});
	});

	describe('modifier', () => {
		it('should generate modifier className', () => {
			expect(modifier('foo', 'm')).toBe('foo-m');
		});
	});

	describe('bem', () => {
		it('should generate block className with 1 argument', () => {
			expect(bem('foo')).toBe('foo');
		});
		it('should generate modified block className with second argument as modifiers', () => {
			expect(bem('foo', ['m', {m2: true}])).toBe('foo foo-m foo-m2');
		});
		it('should generate element className with second element as string', () => {
			expect(bem('foo', 'bar')).toBe('foo--bar');
		});
		it('should generate modified element classname with third argument as modifiers', () => {
			expect(bem('foo', 'bar', ['m', {m2: true}])).toBe('foo--bar foo--bar-m foo--bar-m2');
		});
	});

	/*eslint-disable padded-blocks*/
	describe('BEM decorator', () => {
		@BEM('foo')
		class Foo {

		}

		const foo = new Foo();
		it('should inject bem() method to target prototype', () => {
			expect(Foo.prototype['bem']).toBeDefined();
			expect(foo['bem']).toBeDefined();
		});
		it('should inject bem() method bound to passed block name', () => {
			expect(foo['bem']()).toBe('foo');
			expect(foo['bem']('bar')).toBe('foo--bar');
		});
	});
});
