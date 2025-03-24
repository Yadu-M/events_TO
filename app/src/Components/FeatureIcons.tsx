import { EventFeature } from '@/types';

export const FeatureIcons: Record<EventFeature, JSX.Element> = {
	'Public Washrooms': (
		<img key={1} src="/feature_icons/toilet.png" className="w-10 h-10 object-cover" title="Public Washrooms" />
		// <a
		//   href="https://www.flaticon.com/free-icons/restroom"
		//   title="restroom icons"
		// >
		//   Restroom icons created by Freepik - Flaticon
		// </a>
	),
	'Free Parking': (
		<img key={2} src="/feature_icons/free-parking.png" className="w-10 h-10 object-cover" title="Free Parking" />
		// <a
		//   href="https://www.flaticon.com/free-icons/free-parking"
		//   title="free parking icons"
		// >
		//   Free parking icons created by Freepik - Flaticon
		// </a>
	),
	'Paid Parking': (
		<img key={3} src="/feature_icons/parking.png" className="w-10 h-10 object-cover" title="Paid Parking" />
		// <a href="https://www.flaticon.com/free-icons/paid" title="paid icons">
		//   Paid icons created by Freepik - Flaticon
		// </a>
	),
	'Bike Racks': (
		<img key={4} src="/feature_icons/bicycle.png" className="w-10 h-10 object-cover" title="Bike Racks" />
		// <a
		//   href="https://www.flaticon.com/free-icons/bike-parking"
		//   title="bike parking icons"
		// >
		//   Bike parking icons created by pojok d - Flaticon
		// </a>
	),
	'Onsite Food and Beverages': (
		<img key={5} src="/feature_icons/coffee.png" className="w-10 h-10 object-cover" title="Onsite Food and Beverages" />
		// <a
		//   href="https://www.flaticon.com/free-icons/beverage"
		//   title="beverage icons"
		// >
		//   Beverage icons created by wanicon - Flaticon
		// </a>
	),
};
