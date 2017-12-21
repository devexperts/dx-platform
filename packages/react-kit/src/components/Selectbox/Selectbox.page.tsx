import React from 'react';
import { storiesOf } from '@devexperts/tools/lib/utils/storybook';
import Demo from '../demo/Demo';
import { Button } from '../Button/Button';
import { Selectbox, TFullSelectboxProps } from './Selectbox';
import { SelectboxAnchor, TFullSelectboxAnchorProps } from './SelectboxAnchor';
import { MenuItem } from '../Menu/Menu';
import { PURE } from '../../utils/pure';

import {ListItemTickIcon} from '@devexperts/icons/lib/list-item-tick-icon';
import {SmallDropDownArrowIcon} from '@devexperts/icons/lib/small-dropdown-arrow-icon';
import { stateful } from '../Control/Control';

import * as selectoxPageCss from './Selectbox.page.styl';
import {ObjectClean} from 'typelevel-ts';
import {PartialKeys} from '@devexperts/utils/src/object/object';
const wideSelectboxTheme = {
	container__anchor: selectoxPageCss.container__anchor
};

class DemoSelectboxAnchor extends React.Component<TFullSelectboxAnchorProps> {
	render() {
		const newProps = {
			...this.props,
			isPrimary: true
		};
		return <SelectboxAnchor {...newProps}/>;
	}
}

class DemoSelectbox extends React.Component<ObjectClean<PartialKeys<TFullSelectboxProps,
    | 'theme'
    | 'Anchor'
    | 'Menu'
    | 'Popover'>>> {
	render() {
		const newProps = {
			...this.props,
			AnchorComponent: DemoSelectboxAnchor,
			caretIcon: <SmallDropDownArrowIcon/>,
		};

		return <Selectbox {...newProps} />;
	}
}

const Stateful = stateful()(DemoSelectbox);

type TPageState = {
	hero: string
}

@PURE
class SelectboxPage extends React.Component<{}, TPageState> {
	state = {
		hero: ''
	}

	render() {
		return (
			<Demo>
				<div>
					<Stateful placeholder="Choose your hero"
					          selectedIcon={<ListItemTickIcon/>}
					          onValueChange={this.onHeroChange}
					          caretIcon={<SmallDropDownArrowIcon/>}>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</Stateful>
					<DemoSelectbox placeholder="Controlled by left"
					               value={this.state.hero}
								   theme={{}}
								   selectedIcon={<ListItemTickIcon/>}
					               onValueChange={this.onHeroChange}
								   caretIcon={<SmallDropDownArrowIcon/>}>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</DemoSelectbox>
					<Stateful placeholder="Loading"
					          isDisabled={true}
					          isLoading={true}>
						<MenuItem value="dummy">Dummy</MenuItem>
					</Stateful>
					<Button onClick={this.onResetClick}>Reset</Button>
				</div>
				<section>
					Sync width
					<Stateful placeholder="Choose your hero"
					          shouldSyncWidth={true}
					          theme={wideSelectboxTheme}
							  selectedIcon={<ListItemTickIcon/>}
							  caretIcon={<SmallDropDownArrowIcon/>}>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</Stateful>
				</section>
			</Demo>
		);
	}

	onHeroChange = (hero: string) => {
		this.setState({
			hero
		});
	}

	onResetClick = () => {
		this.setState({
			hero: ''
		});
	}
}

storiesOf('Selectbox', module).add('default', () => <SelectboxPage/>);