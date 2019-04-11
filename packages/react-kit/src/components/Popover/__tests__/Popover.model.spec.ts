import {
	PopoverPlacement,
	PopoverAlign,
	TVerticalMoveProps,
	TVerticalPosition,
	movePopoverVertically,
	THorizontalMoveProps,
	THorizontalPosition,
	movePopoverHorizontally,
} from '../Popover.model';
import { PartialKeys } from '@devexperts/utils/dist/object';

const createMoveVertically: (
	defaultProps: PartialKeys<TVerticalMoveProps, 'placement'>,
) => (
	props: Partial<TVerticalMoveProps> & Pick<TVerticalMoveProps, 'placement'>,
) => TVerticalPosition | undefined = defaultProps => props =>
	movePopoverVertically({ ...defaultProps, checkBounds: true, ...props });

const createMoveHorizontally: (
	defaultProps: PartialKeys<THorizontalMoveProps, 'placement'>,
) => (
	props: Partial<THorizontalMoveProps> & Pick<THorizontalMoveProps, 'placement'>,
) => THorizontalPosition | undefined = defaultProps => props =>
	movePopoverHorizontally({ ...defaultProps, checkBounds: true, ...props });

const placementTop = PopoverPlacement.Top;
const placementBottom = PopoverPlacement.Bottom;
const placementLeft = PopoverPlacement.Left;
const placementRight = PopoverPlacement.Right;

const alignTop = PopoverAlign.Top;
const alignBottom = PopoverAlign.Bottom;
const alignLeft = PopoverAlign.Left;
const alignRight = PopoverAlign.Right;
const alignMiddle = PopoverAlign.Middle;
const alignCenter = PopoverAlign.Center;

describe('Popover.model', () => {
	describe('move popover vertically', () => {
		it('should open upward', () => {
			const anchorTop = 50;
			const popoverHeight = 20;
			const top = anchorTop - popoverHeight;
			const result: TVerticalPosition = {
				placement: placementTop,
				align: alignCenter,
				top,
			};
			expect(
				movePopoverVertically({
					placement: placementTop,
					align: alignCenter,
					anchorTop,
					anchorBottom: 55,
					popoverHeight,
					parentHeight: 105,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should open downward', () => {
			const anchorBottom = 55;
			const top = anchorBottom;
			const result: TVerticalPosition = {
				placement: placementBottom,
				align: alignCenter,
				top,
			};
			expect(
				movePopoverVertically({
					placement: placementBottom,
					align: alignCenter,
					anchorTop: 50,
					anchorBottom,
					popoverHeight: 20,
					parentHeight: 105,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should try open upward and will open downward', () => {
			const anchorBottom = 20;
			const top = anchorBottom;
			const result: TVerticalPosition = {
				placement: placementBottom,
				align: alignCenter,
				top,
			};
			expect(
				movePopoverVertically({
					placement: placementTop,
					align: alignCenter,
					anchorTop: 10,
					anchorBottom,
					popoverHeight: 20,
					parentHeight: 105,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should try open downward and will open upward', () => {
			const anchorTop = 95;
			const popoverHeight = 20;
			const top = anchorTop - popoverHeight;
			const result: TVerticalPosition = {
				placement: placementTop,
				align: alignCenter,
				top,
			};
			expect(
				movePopoverVertically({
					placement: placementBottom,
					align: alignCenter,
					anchorTop,
					anchorBottom: 105,
					popoverHeight,
					parentHeight: 105,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should try open upward, downward and will open upward', () => {
			const anchorTop = 4;
			const popoverHeight = 20;
			const top = anchorTop - popoverHeight;
			const result: TVerticalPosition = {
				placement: placementTop,
				align: alignCenter,
				top,
			};
			expect(
				movePopoverVertically({
					placement: placementTop,
					align: alignCenter,
					anchorTop,
					anchorBottom: 6,
					popoverHeight,
					parentHeight: 20,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should try open downward, upward and will open downward', () => {
			const anchorBottom = 6;
			const top = anchorBottom;
			const result: TVerticalPosition = {
				top,
				placement: placementBottom,
				align: alignCenter,
			};
			expect(
				movePopoverVertically({
					placement: placementBottom,
					align: alignCenter,
					anchorTop: 4,
					anchorBottom,
					popoverHeight: 20,
					parentHeight: 20,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should return undefined for left and right placement', () => {
			const curriedMove = createMoveVertically({
				align: alignCenter,
				anchorTop: 50,
				anchorBottom: 50,
				popoverHeight: 20,
				parentHeight: 105,
			});
			expect(curriedMove({ placement: placementLeft })).toBe(undefined);
			expect(curriedMove({ placement: placementRight })).toBe(undefined);
		});

		it('should return undefined for left, center and right align', () => {
			const curriedMove = createMoveVertically({
				align: alignCenter,
				anchorTop: 50,
				anchorBottom: 50,
				popoverHeight: 20,
				parentHeight: 105,
			});
			expect(curriedMove({ placement: placementLeft, align: alignLeft })).toBe(undefined);
			expect(curriedMove({ placement: placementLeft, align: alignCenter })).toBe(undefined);
			expect(curriedMove({ placement: placementLeft, align: alignRight })).toBe(undefined);
		});
	});

	describe('move popover horizontally', () => {
		it('should open leftward', () => {
			const anchorLeft = 50;
			const popoverWidth = 20;
			const left = anchorLeft - popoverWidth;
			const result: THorizontalPosition = {
				placement: placementLeft,
				align: alignCenter,
				left,
			};
			expect(
				movePopoverHorizontally({
					placement: placementLeft,
					align: alignCenter,
					anchorLeft,
					anchorRight: 50,
					popoverWidth,
					parentWidth: 105,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should open rightward', () => {
			const anchorRight = 50;
			const left = anchorRight;
			const result: THorizontalPosition = {
				placement: placementRight,
				align: alignCenter,
				left,
			};
			expect(
				movePopoverHorizontally({
					placement: placementRight,
					align: alignCenter,
					anchorLeft: 50,
					anchorRight,
					popoverWidth: 20,
					parentWidth: 105,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should try open leftward and will open rightward', () => {
			const anchorRight = 10;
			const left = anchorRight;
			const result: THorizontalPosition = {
				placement: placementRight,
				align: alignCenter,
				left,
			};
			expect(
				movePopoverHorizontally({
					align: alignCenter,
					anchorLeft: 0,
					anchorRight,
					popoverWidth: 20,
					parentWidth: 105,
					placement: placementLeft,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should try open rightward and will open leftward', () => {
			const anchorLeft = 100;
			const popoverWidth = 20;
			const left = anchorLeft - popoverWidth;
			const result: THorizontalPosition = {
				left,
				placement: placementLeft,
				align: alignCenter,
			};
			expect(
				movePopoverHorizontally({
					align: alignCenter,
					anchorLeft: 100,
					anchorRight: 105,
					popoverWidth,
					parentWidth: 105,
					placement: placementRight,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should try open leftward, rightward and will open leftward', () => {
			const anchorLeft = 4;
			const popoverWidth = 20;
			const left = anchorLeft - popoverWidth;
			const result: THorizontalPosition = {
				placement: placementLeft,
				align: alignCenter,
				left,
			};
			expect(
				movePopoverHorizontally({
					placement: placementLeft,
					align: alignCenter,
					anchorLeft,
					anchorRight: 6,
					popoverWidth,
					parentWidth: 20,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should try open rightward, leftward and will open rightward', () => {
			const anchorRight = 6;
			const left = anchorRight;
			const result: THorizontalPosition = {
				placement: placementRight,
				align: alignCenter,
				left,
			};
			expect(
				movePopoverHorizontally({
					placement: placementRight,
					align: alignCenter,
					anchorLeft: 4,
					anchorRight,
					popoverWidth: 20,
					parentWidth: 20,
					checkBounds: true,
				}),
			).toEqual(result);
		});

		it('should return undefined for top and bottom placement', () => {
			const curriedMove = createMoveHorizontally({
				align: alignMiddle,
				anchorLeft: 50,
				anchorRight: 50,
				popoverWidth: 20,
				parentWidth: 105,
			});
			expect(curriedMove({ placement: placementTop })).toBe(undefined);
			expect(curriedMove({ placement: placementBottom })).toBe(undefined);
		});

		it('should return undefined for top, middle and bottom align', () => {
			const curriedMove = createMoveHorizontally({
				align: alignCenter,
				anchorLeft: 50,
				anchorRight: 50,
				popoverWidth: 20,
				parentWidth: 105,
			});
			expect(curriedMove({ placement: placementTop, align: alignTop })).toBe(undefined);
			expect(curriedMove({ placement: placementTop, align: alignMiddle })).toBe(undefined);
			expect(curriedMove({ placement: placementTop, align: alignBottom })).toBe(undefined);
		});
	});
});
