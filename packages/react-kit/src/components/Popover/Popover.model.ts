export enum PopoverPlacement {
	Top = 'Top',
	Bottom = 'Bottom',
	Left = 'Left',
	Right = 'Right',
}

export enum PopoverAlign {
	Top = 'Top',
	Bottom = 'Bottom',
	Left = 'Left',
	Right = 'Right',
	Middle = 'Middle',
	Center = 'Center',
}
export type TVerticalPosition = {
	top: number;
	placement: PopoverPlacement;
	align: PopoverAlign;
};

export type TVerticalMoveProps = {
	placement: PopoverPlacement;
	align: PopoverAlign;
	anchorTop: number;
	anchorBottom: number;
	popoverHeight: number;
	parentHeight: number;
	previousPlacement?: PopoverPlacement;
	checkBounds?: boolean;
};

export function movePopoverVertically({
	placement,
	align,
	anchorTop,
	anchorBottom,
	popoverHeight,
	parentHeight,
	previousPlacement,
	checkBounds = false,
}: TVerticalMoveProps): TVerticalPosition | undefined {
	switch (placement) {
		case PopoverPlacement.Top: {
			const top = anchorTop - popoverHeight;

			if (checkBounds && top < 0) {
				switch (previousPlacement) {
					case PopoverPlacement.Bottom:
					case PopoverPlacement.Top:
						return movePopoverVertically({
							placement: previousPlacement,
							align,
							anchorTop,
							anchorBottom,
							popoverHeight,
							parentHeight,
							previousPlacement: placement,
						});
					case PopoverPlacement.Left:
					case PopoverPlacement.Right:
						return undefined;
				}
				return movePopoverVertically({
					placement: PopoverPlacement.Bottom,
					align,
					anchorTop,
					anchorBottom,
					popoverHeight,
					parentHeight,
					previousPlacement: placement,
					checkBounds: true,
				});
			}
			return {
				top,
				placement,
				align,
			};
		}
		case PopoverPlacement.Bottom: {
			const top = anchorBottom;
			if (checkBounds && top + popoverHeight > parentHeight) {
				switch (previousPlacement) {
					case PopoverPlacement.Top:
					case PopoverPlacement.Bottom:
						return movePopoverVertically({
							placement: previousPlacement,
							align,
							anchorTop,
							anchorBottom,
							popoverHeight,
							parentHeight,
							previousPlacement: placement,
						});
					case PopoverPlacement.Left:
					case PopoverPlacement.Right:
						return undefined;
				}
				return movePopoverVertically({
					placement: PopoverPlacement.Top,
					align,
					anchorTop,
					anchorBottom,
					popoverHeight,
					parentHeight,
					previousPlacement: placement,
					checkBounds: true,
				});
			}
			return {
				top,
				placement,
				align,
			};
		}
	}

	switch (align) {
		case PopoverAlign.Top: {
			const top = anchorTop;
			if (checkBounds && top + popoverHeight > parentHeight) {
				const resultForMiddle = movePopoverVertically({
					placement,
					align: PopoverAlign.Middle,
					anchorTop,
					anchorBottom,
					popoverHeight,
					parentHeight,
				});
				if (resultForMiddle && resultForMiddle.top + popoverHeight > parentHeight) {
					return movePopoverVertically({
						placement,
						align: PopoverAlign.Bottom,
						anchorTop,
						anchorBottom,
						popoverHeight,
						parentHeight,
					});
				}
				return resultForMiddle;
			}
			return {
				top,
				placement,
				align,
			};
		}
		case PopoverAlign.Middle: {
			const top = anchorTop + (anchorBottom - anchorTop) / 2 - popoverHeight / 2;
			if (checkBounds) {
				if (top < 0) {
					return movePopoverVertically({
						placement,
						align: PopoverAlign.Top,
						anchorTop,
						anchorBottom,
						popoverHeight,
						parentHeight,
					});
				} else if (top + popoverHeight > parentHeight) {
					return movePopoverVertically({
						placement,
						align: PopoverAlign.Bottom,
						anchorTop,
						anchorBottom,
						popoverHeight,
						parentHeight,
					});
				}
			}
			return {
				top,
				placement,
				align,
			};
		}
		case PopoverAlign.Bottom: {
			const top = anchorBottom - popoverHeight;
			if (checkBounds && top < 0) {
				const resultForMiddle = movePopoverVertically({
					placement,
					align: PopoverAlign.Middle,
					anchorTop,
					anchorBottom,
					popoverHeight,
					parentHeight,
				});
				if (resultForMiddle && resultForMiddle.top < 0) {
					return movePopoverVertically({
						placement,
						align: PopoverAlign.Top,
						anchorTop,
						anchorBottom,
						popoverHeight,
						parentHeight,
					});
				}
				return resultForMiddle;
			}
			return {
				top,
				placement,
				align,
			};
		}
	}

	return undefined;
}

export type THorizontalMoveProps = {
	placement: PopoverPlacement;
	align: PopoverAlign;
	anchorLeft: number;
	anchorRight: number;
	popoverWidth: number;
	parentWidth: number;
	checkBounds?: Boolean;
	previousPlacement?: PopoverPlacement;
};

export type THorizontalPosition = {
	left: number;
	placement: PopoverPlacement;
	align: PopoverAlign;
};

export function movePopoverHorizontally({
	placement,
	align,
	anchorLeft,
	anchorRight,
	popoverWidth,
	parentWidth,
	checkBounds = false,
	previousPlacement,
}: THorizontalMoveProps): THorizontalPosition | undefined {
	switch (placement) {
		case PopoverPlacement.Left: {
			const left = anchorLeft - popoverWidth;
			if (checkBounds && left < 0) {
				switch (previousPlacement) {
					case PopoverPlacement.Right:
					case PopoverPlacement.Left:
						return movePopoverHorizontally({
							placement: previousPlacement,
							align,
							anchorLeft,
							anchorRight,
							popoverWidth,
							parentWidth,
							previousPlacement: placement,
						});
					case PopoverPlacement.Top:
					case PopoverPlacement.Bottom:
						return undefined;
				}
				return movePopoverHorizontally({
					placement: PopoverPlacement.Right,
					align,
					anchorLeft,
					anchorRight,
					popoverWidth,
					parentWidth,
					previousPlacement: placement,
					checkBounds: true,
				});
			}
			return {
				left,
				placement,
				align,
			};
		}
		case PopoverPlacement.Right: {
			const left = anchorRight;
			if (checkBounds && left + popoverWidth > parentWidth) {
				switch (previousPlacement) {
					case PopoverPlacement.Left:
					case PopoverPlacement.Right:
						return movePopoverHorizontally({
							placement: previousPlacement,
							align,
							anchorLeft,
							anchorRight,
							popoverWidth,
							parentWidth,
							previousPlacement: placement,
						});
					case PopoverPlacement.Top:
					case PopoverPlacement.Bottom:
						return undefined;
				}
				return movePopoverHorizontally({
					placement: PopoverPlacement.Left,
					align,
					anchorLeft,
					anchorRight,
					popoverWidth,
					parentWidth,
					previousPlacement: placement,
					checkBounds: true,
				});
			}
			return {
				left,
				placement,
				align,
			};
		}
	}

	switch (align) {
		case PopoverAlign.Left: {
			const left = anchorLeft;
			if (checkBounds && left + popoverWidth > parentWidth) {
				const resultForCenter = movePopoverHorizontally({
					placement,
					align: PopoverAlign.Center,
					anchorLeft,
					anchorRight,
					popoverWidth,
					parentWidth,
				});
				if (resultForCenter && resultForCenter.left + popoverWidth > parentWidth) {
					return movePopoverHorizontally({
						placement,
						align: PopoverAlign.Right,
						anchorLeft,
						anchorRight,
						popoverWidth,
						parentWidth,
					});
				}
				return resultForCenter;
			}
			return {
				left,
				placement,
				align,
			};
		}
		case PopoverAlign.Center: {
			const left = anchorLeft + (anchorRight - anchorLeft) / 2 - popoverWidth / 2;
			if (checkBounds) {
				if (left < 0) {
					return movePopoverHorizontally({
						placement,
						align: PopoverAlign.Left,
						anchorLeft,
						anchorRight,
						popoverWidth,
						parentWidth,
					});
				} else if (left + popoverWidth > parentWidth) {
					return movePopoverHorizontally({
						placement,
						align: PopoverAlign.Right,
						anchorLeft,
						anchorRight,
						popoverWidth,
						parentWidth,
					});
				}
			}
			return {
				left,
				placement,
				align,
			};
		}
		case PopoverAlign.Right: {
			const left = anchorRight - popoverWidth;
			if (checkBounds && left < 0) {
				const resultForCenter = movePopoverHorizontally({
					placement,
					align: PopoverAlign.Center,
					anchorLeft,
					anchorRight,
					popoverWidth,
					parentWidth,
				});
				if (resultForCenter && resultForCenter.left < 0) {
					return movePopoverHorizontally({
						placement,
						align: PopoverAlign.Left,
						anchorLeft,
						anchorRight,
						popoverWidth,
						parentWidth,
					});
				}
				return resultForCenter;
			}
			return {
				left,
				placement,
				align,
			};
		}
	}

	return undefined;
}

export function getPlacementModifier(placement: PopoverPlacement): string {
	switch (placement) {
		case PopoverPlacement.Bottom: {
			return 'placementBottom';
		}
		case PopoverPlacement.Top: {
			return 'placementTop';
		}
		case PopoverPlacement.Left: {
			return 'placementLeft';
		}
		case PopoverPlacement.Right: {
			return 'placementRight';
		}
	}
}
