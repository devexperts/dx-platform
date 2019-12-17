import { DragDropContext } from 'react-dnd';
import { HTML5Backend } from './react-dnd-proxy';

export const DNDTypes = {
	ITEM: 'item',
};

class CustomBackend extends HTML5Backend {
	handleTopDragOver(e: DragEvent) {
		const item = this.monitor.getItem();
		let fits;

		switch (item.type) {
			case DNDTypes.ITEM:
				fits = true;
				break;
			// the default state is for Layout drag
			default:
				if (this.dragOverTargetIds.length === 1) {
					const canDrop = this.monitor.canDropOnTarget(this.dragOverTargetIds[0]);
					if (canDrop) {
						const { isEmptyRoot, placement } = canDrop;
						//noinspection RedundantIfStatementJS
						if (
							(isEmptyRoot && !placement.fits && typeof placement.side === 'undefined') ||
							(!isEmptyRoot && !placement.fits)
						) {
							fits = false;
						} else {
							fits = true;
						}
					}
				}
		}

		const dataTransfer = e.dataTransfer;
		if (dataTransfer === null) {
			return;
		}
		const originalEffect = dataTransfer.dropEffect;
		super.handleTopDragOver(e);

		if (typeof fits === 'undefined') {
			dataTransfer.dropEffect = originalEffect;
		} else if (fits === false) {
			dataTransfer.dropEffect = 'none';
		} else if (fits === true) {
			dataTransfer.dropEffect = 'copy';
		}
	}
}

//eslint-disable-next-line
export const DNDContext = DragDropContext((manager: any) => new CustomBackend(manager));
