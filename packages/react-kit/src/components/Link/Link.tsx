import React from 'react';
import { PURE } from '../../utils/pure';
import classnames from 'classnames';
import { MouseEvent, EventHandler, ComponentClass } from 'react';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';

export const LINK = Symbol('Link') as symbol;

export type TFullLinkProps = {
	children: React.ReactNode;
	href?: string;
	target?: string;
	rel?: string;
	download?: string;
	isDisabled?: boolean;
	processEmptyHash?: boolean;
	onClick?: EventHandler<MouseEvent<HTMLAnchorElement>>;
	theme: {
		container?: string;
		container_isDisabled?: string;
	};
};

@PURE
class RawLink extends React.Component<TFullLinkProps> {
	render() {
		const { isDisabled, rel, href, target, children, theme, download } = this.props;

		const className = classnames(theme.container, {
			[theme.container_isDisabled as string]: isDisabled,
		});

		return (
			<a href={href} download={download} rel={rel} target={target} onClick={this.onClick} className={className}>
				{children}
			</a>
		);
	}

	onClick = (e: MouseEvent<HTMLAnchorElement>) => {
		if (this.props.isDisabled || (!this.props.processEmptyHash && this.props.href === '#')) {
			e.preventDefault();
		}
		this.props.onClick && this.props.onClick(e);
	};
}

export type TLinkProps = PartialKeys<TFullLinkProps, 'theme'>;
export const Link: ComponentClass<TLinkProps> = withTheme(LINK)(RawLink);
