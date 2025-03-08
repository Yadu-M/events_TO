export async function storeImages(resource: { API_URL: string; TOKEN: string }) {
	const { API_URL, TOKEN } = resource;
	const image = await fetch('https://secure.toronto.ca//webapps/CC/fileAPI/edc_eventcal/F&E%20Listings%20(20)_fb2zziOPwDiNhiXaH_sZUw.png');
	const bytes = await image.bytes();

	const formData = new FormData();
	formData.append('file', new File([bytes], 'image.png'));

	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
		body: formData,
	});

	console.log(response);
}
