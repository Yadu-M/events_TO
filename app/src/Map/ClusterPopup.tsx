import { ClusterFeatureCollection } from '@/types';
import { Popup } from './Popup';

interface Props {
	cluster: ClusterFeatureCollection;
}

export const ClusterPopup = ({ cluster }: Props) => {
	return (
		<div className="absolute left-0 right-0 max-w-[30rem] h-full bg-white shadow-lg z-20 overflow-y-auto p-5 flex flex-col gap-20">			
			{cluster.features.map((feature) => (
				<Popup key={feature.properties.eventId} feature={feature} />
			))}
		</div>
	);
};
