import { ComponentType } from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';

/**
 * Higher order component that applies the specified default props to the component.
 * These props will become optional in the type of the returned component. Example:
 * 
 * ```ts
 * // in the original type, "assignee" is a required prop
 * type TTaskProps = { summary: string; assignee: string };
 *
 * const TaskCard: SFC<TTaskProps> = props =>
 *     <div>{props.summary} - <i>{props.assignee}</i></div>;
 * 
 * // specify the default value for the "assignee" prop
 * const TaskCardWithDefaults = withDefaults<
 *     TTaskProps, 'assignee'
 * >({assignee: 'unassigned'})(TaskCard);
 * 
 * render() {
 *     // note how "assignee" became optional here
 *     return <TaskCardWithDefaults summary="Provide an example" />;
 * }
 * ```
 *
 * @typeparam P props type of the target component
 * 
 * @typeparam Keys union of props for which the defaults will be specified
 * 
 * @param defaults the default property values to apply to the component
 * 
 */
export const withDefaults = <P extends object, Keys extends keyof P>(
	defaults: Pick<P, Keys>,
): ((Target: ComponentType<P>) => ComponentType<PartialKeys<P, Keys>>) => Target => {
	Target.defaultProps = Object.assign({}, Target.defaultProps || {}, defaults); // tslint:disable-line
	return Target as any; // tslint:disable-line
};
