import React from 'react';
import { storiesOf } from '@storybook/react';
import Demo from '../demo/Demo';
import { Button } from '../Button/Button';
import { Selectbox, SelectboxValue, TFullSelectboxProps } from './Selectbox';
import { SelectboxAnchor, TFullSelectboxAnchorProps } from './SelectboxAnchor';
import { MenuItem } from '../Menu/Menu';
import { PURE } from '../../utils/pure';

import { ListItemTickIcon } from '../../icons/list-item-tick-icon';
import { SmallDropDownArrowIcon } from '../../icons/small-dropdown-arrow-icon';
import { stateful } from '../Control/Control';

import selectoxPageCss from './Selectbox.page.styl';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { ReactNode, ReactText } from 'react';

const wideSelectboxTheme = {
	container__anchor: selectoxPageCss.container__anchor,
};

class DemoSelectboxAnchor extends React.Component<TFullSelectboxAnchorProps> {
	render() {
		const newProps = {
			...this.props,
			isPrimary: true,
		};
		return <SelectboxAnchor {...newProps} />;
	}
}

class DemoSelectbox extends React.Component<PartialKeys<TFullSelectboxProps, 'theme' | 'Anchor' | 'Menu' | 'Popover'>> {
	render() {
		const newProps = {
			...this.props,
			AnchorComponent: DemoSelectboxAnchor,
			caretIcon: <SmallDropDownArrowIcon />,
		};

		return <Selectbox {...newProps} />;
	}
}

const Stateful = stateful()(DemoSelectbox);
const StatefulOpened = stateful('isOpened', 'onToggle')(Stateful);

type TPageState = {
	hero: string;
	isFirstSelectboxOpened: boolean | undefined;
	isSecondSelectboxOpened: boolean | undefined;
	isThirdSelectboxOpened: boolean | undefined;
	isFoughtSelectboxOpened: boolean | undefined;
};

@PURE
class SelectboxPage extends React.Component<{}, TPageState> {
	state = {
		hero: '',
		isFirstSelectboxOpened: false,
		isSecondSelectboxOpened: false,
		isThirdSelectboxOpened: false,
		isFoughtSelectboxOpened: false,
	};

	render() {
		return (
			<Demo>
				<div>
					<Stateful
						defaultValue={undefined}
						placeholder="Choose your hero"
						isOpened={this.state.isFirstSelectboxOpened}
						onToggle={this.onFirstSelectboxToggle}
						selectedIcon={<ListItemTickIcon />}
						onValueChange={this.onHeroChange as any}
						caretIcon={<SmallDropDownArrowIcon />}>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</Stateful>
					<DemoSelectbox
						placeholder="Controlled by left"
						value={this.state.hero}
						theme={{}}
						isOpened={this.state.isSecondSelectboxOpened}
						onToggle={this.onSecondSelectboxToggle}
						selectedIcon={<ListItemTickIcon />}
						onValueChange={this.onHeroChange as any}
						caretIcon={<SmallDropDownArrowIcon />}>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</DemoSelectbox>
					<Stateful
						defaultValue={undefined}
						placeholder="Loading"
						isOpened={this.state.isThirdSelectboxOpened}
						onToggle={this.onThirdSelectboxToggle}
						isDisabled={true}
						isLoading={true}>
						<MenuItem value="dummy">Dummy</MenuItem>
					</Stateful>
					<Button onClick={this.onResetClick}>Reset</Button>
				</div>
				<section>
					Sync width
					<Stateful
						defaultValue={undefined}
						placeholder="Choose your hero"
						isOpened={this.state.isFoughtSelectboxOpened}
						onToggle={this.onFoughtSelectboxToggle}
						shouldSyncWidth={true}
						theme={wideSelectboxTheme}
						selectedIcon={<ListItemTickIcon />}
						caretIcon={<SmallDropDownArrowIcon />}>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</Stateful>
				</section>
				<section>
					Uncontrolled by isOpened
					<StatefulOpened
						defaultValue={undefined}
						placeholder="Choose your hero"
						shouldSyncWidth={true}
						theme={wideSelectboxTheme}
						selectedIcon={<ListItemTickIcon />}
						caretIcon={<SmallDropDownArrowIcon />}>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</StatefulOpened>
				</section>
			</Demo>
		);
	}

	onHeroChange = (hero: string) => {
		this.setState({
			hero,
		});
	};

	onResetClick = () => {
		this.setState({
			hero: '',
		});
	};

	onFirstSelectboxToggle = (isFirstSelectboxOpened: boolean | undefined) => {
		this.setState({
			isFirstSelectboxOpened,
		});
	};

	onSecondSelectboxToggle = (isSecondSelectboxOpened: boolean | undefined) => {
		this.setState({
			isSecondSelectboxOpened,
		});
	};

	onThirdSelectboxToggle = (isThirdSelectboxOpened: boolean | undefined) => {
		this.setState({
			isThirdSelectboxOpened,
		});
	};

	onFoughtSelectboxToggle = (isFoughtSelectboxOpened: boolean | undefined) => {
		this.setState({
			isFoughtSelectboxOpened,
		});
	};
}

type MultiplePageState = {
	value?: SelectboxValue;
	isOpened?: boolean;
};

type MultiplePageProps = {
	multipleFormatter?: (value: ReactText[]) => ReactNode;
};

@PURE
class SelectboMultiplePage extends React.Component<MultiplePageProps, MultiplePageState> {
	state = {
		isOpened: false,
	};

	render() {
		const { multipleFormatter } = this.props;
		return (
			<Demo>
				<Stateful
					defaultValue={['superman', 'batman']}
					placeholder="Choose your hero"
					multipleFormatter={multipleFormatter}
					isOpened={this.state.isOpened}
					onToggle={this.onToggle}
					selectedIcon={<ListItemTickIcon />}
					onValueChange={this.onValueChange}
					caretIcon={<SmallDropDownArrowIcon />}>
					<MenuItem value="superman">Superman</MenuItem>
					<MenuItem value="batman">Batman</MenuItem>
					<MenuItem value="flash">Flash</MenuItem>
				</Stateful>
			</Demo>
		);
	}

	onValueChange = (value: SelectboxValue) => {
		this.setState({
			value,
		});
	};

	onToggle = (isOpened?: boolean) => {
		this.setState({
			isOpened,
		});
	};
}

storiesOf('Selectbox', module)
	.add('default', () => <SelectboxPage />)
	.add('multiple', () => (
		<Demo>
			<SelectboMultiplePage />
		</Demo>
	))
	.add('multiple formatter', () => (
		<Demo>
			<SelectboMultiplePage multipleFormatter={value => `Selected ${value.length} item`} />
		</Demo>
	));
