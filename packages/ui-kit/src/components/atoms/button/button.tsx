import * as React from 'react';
import styled from 'styled-components';
import { ButtonHTMLAttributes } from 'react';
import { getTransition } from '../../../utils/style';

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'buy' | 'sell';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
	type: ButtonType;
	isDisabled?: boolean;
}

export const Button = styled((props: ButtonProps) => {
	const { type, isDisabled, ...rest } = props;
	return <button disabled={isDisabled} {...rest} />;
})`
	font-family: inherit;
	font-size: 14px;
	border-radius: 1px;
	border-width: 1px;
	border-style: solid;
	color: #ffffff;
	border-color: rgba(0, 0, 0, 0.4);
	outline: none;
	transition: ${getTransition('color', 'border-color', 'box-shadow', 'background-color')};

	${getTypeStyle};

	&:disabled {
		color: rgba(255, 255, 255, 0.3);
		background-color: #4d4d4d;
		box-shadow: none;
		border-color: rgba(0, 0, 0, 0.4);
	}
`;

function getTypeStyle(props: ButtonProps): string {
	switch (props.type) {
		case 'primary': {
			return `
				box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1), inset 1px 0 0 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02);
				background-color: #2f5061;
				&:hover {
					box-shadow: inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 1px 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.02);
					background-color: #446171;
				}	
				&:active {
					box-shadow: inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset -1px 0 0 0 rgba(255, 255, 255, 0.1), inset 1px 0 0 0 rgba(255, 255, 255, 0.1);
					background-color: #284452;
				}
				&:focus {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset -1px 0 0 0 rgba(255, 255, 255, 0.1), inset 1px 0 0 0 rgba(255, 255, 255, 0.1);
					border-color: #457d99;
					background-color: #2f5061;
				}
			`;
		}
		case 'secondary': {
			return `
				box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 1px 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
				background-color: #4a4540;
				&:hover {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 1px 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
					background-color: #5c5753;
				}
				&:active {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 1px 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
					background-color: #3f3a36;
				}
				&:focus {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 1px 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
					border-color: #457d99;
					background-color: #4a4540;
				}
			`;
		}
		case 'tertiary': {
			return `
				box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 0 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
				background-color: #4a4540;
				&:hover {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 0 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
					background-color: #5c5753;
				}
				&:active {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 0 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
					background-color: #3f3a36;
				}
				&:focus {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 0 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
					border-color: #457d99;
					background-color: #4a4540;
				}
			`;
		}
		case 'sell': {
			return `
				box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 0 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
				background-color: #a02c28;
				&:hover {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 1px 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
					background-color: #aa413d;
				}
				&:active {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 1px 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
					background-color: #882522;
				}
				&:focus {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 1px 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
					border-color: #457d99;
					background-color: #a02c28;
				} 
			`;
		}
		case 'buy': {
			return `
				box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset 1px 0 0 0 rgba(255, 255, 255, 0.1), inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
				background-color: #3a662e;
				&:hover {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset -1px 0 0 0 rgba(255, 255, 255, 0.1), inset 1px 0 0 0 rgba(255, 255, 255, 0.1);
					background-color: #4e7543;
				}
				&:active {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset -1px 0 0 0 rgba(255, 255, 255, 0.1), inset 1px 0 0 0 rgba(255, 255, 255, 0.1);
					background-color: #315727;
				}
				&:focus {
					box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02), inset 0 -1px 0 0 rgba(255, 255, 255, 0.02), inset -1px 0 0 0 rgba(255, 255, 255, 0.1), inset 1px 0 0 0 rgba(255, 255, 255, 0.1);
					border-color: #457d99;
					background-color: #3a662e;
				}
			`;
		}
	}
}
