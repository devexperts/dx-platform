declare namespace ReactOverlays {
	export namespace Portal {
		export type TPortalProps = JSX.IntrinsicAttributes & {
			container?: React.ReactNode | (() => React.ReactNode);
		};
	}
}

declare module 'react-overlays/lib/Portal' {
	import ComponentClass = React.ComponentClass;
	import TPortalProps = ReactOverlays.Portal.TPortalProps;

	const Portal: ComponentClass<TPortalProps>;
	export = Portal;
}

declare module 'react-overlays/lib/LegacyPortal' {
	import ComponentClass = React.ComponentClass;
	import TPortalProps = ReactOverlays.Portal.TPortalProps;

	const LegacyPortal: ComponentClass<TPortalProps>;
	export = LegacyPortal;
}
