import { fetchEventInfo } from '@/api/api';
import { FeatureIcons } from '@/Components/FeatureIcons';
import { ClusterGeometry, Cost, EventFeature, EventInfo, Location } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Feature } from 'geojson';

interface DataProps {
	type: string;
	data: string | number | null;
}

const DataJSX = ({ type, data }: DataProps) => {
	return data ? (
		<div className="inline text-xs">
			<strong>{type}:</strong> {data}
		</div>
	) : null;
};

const Image = ({ imageURL }: { imageURL?: string }) => {
	return imageURL && <img className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-md mx-auto hidden sm:block" src={imageURL} />;
};

const Description = ({ description }: { description: string }) => {
	const limitDescription = (description: string) => {
		const words = description.split(' ');
		if (words.length > 50) {
			return words.slice(0, 50).join(' ') + ' ...';
		}
		return description;
	};

	return <p className="min-w-10">{limitDescription(description)}</p>;
};

const Features = ({ features }: { features: string }) => {
	return (
		<div className="flex sm:flex-row gap-5 flex-wrap">
			{features.split(',').map((feature) => {
				const typedFeature = feature.trim() as EventFeature;
				return FeatureIcons[typedFeature] || null;
			})}
		</div>
	);
};

const Details = ({ data }: { data: EventInfo }) => {
	return (
		<div className="flex flex-col md:min-w-[65%]">
			<DataJSX type="Category" data={data.event.categoryString} />
			<DataJSX type="Start Date" data={new Date(data.event.startDate).toLocaleString()} />
			<DataJSX type="End Date" data={new Date(data.event.endDate).toLocaleString()} />
			<DataJSX type="Free Event" data={data.event.freeEvent === '1.0' ? 'True' : 'False'} />
			<DataJSX type="Reservation Required" data={data.event.reservationsRequired === '1.0' ? 'True' : 'False'} />
		</div>
	);
};

const Costs = ({ cost }: { cost: Cost }) => {
	return (
		<>
			{cost.priceFrom && <DataJSX type="From" data={`$${cost.priceFrom}`} />}
			{cost.priceTo && <DataJSX type="To" data={`$${cost.priceTo}`} />}
			{cost.adult && <DataJSX type="Adult" data={`$${cost.adult}`} />}
			{cost.child && <DataJSX type="Child" data={`$${cost.child}`} />}
			{cost.generalAdmission && <DataJSX type="General Admission" data={`$${cost.generalAdmission}`} />}
			{cost.senior && <DataJSX type="Senior" data={`$${cost.senior}`} />}
			{cost.student && <DataJSX type="Student" data={`$${cost.student}`} />}
			{cost.youth && <DataJSX type="Youth" data={`$${cost.youth}`} />}
		</>
	);
};

export const Popup = ({ feature }: { feature: Feature<ClusterGeometry, Location> }) => {
	const { status, data, error, isFetching } = useQuery({
		queryKey: ['eventInfo', feature.properties.eventId], // Unique key per eventId
		queryFn: () => fetchEventInfo(feature.properties.eventId),
	});

	return (
		<div>
			{status === 'pending' ? (
				'Loading...'
			) : status === 'error' ? (
				<span>Error: {error?.message ?? 'Unknown error'}</span>
			) : (
				<>
					{isFetching && <div>Background Updating...</div>}
					<h2>{data?.event.eventName ?? 'No Event Name'}</h2>
					<div className="gap-4 my-2 py-2 flex flex-row flex-wrap md:flex-nowrap border-b-2">
						<Image imageURL={feature.properties.imageUrl} />
						<div className="flex flex-col justify-between gap-2">
							<Description description={data.event.description} />
							{data.event.features && <Features features={data.event.features} />}
						</div>
					</div>
					<div className="flex gap-2 mt-1 flex-wrap md:flex-nowrap h-auto">
						<Details data={data} />
						<div className="md:block md:rounded-md md:w-[0.2rem] md:min-h-full md:bg-secondary hidden" />
						<div className="flex flex-col justify-around">{data.cost && <Costs cost={data.cost} />}</div>
					</div>
				</>
			)}
		</div>
	);
};
