import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App.tsx';
import { EventPage } from './Event/EventPage.tsx';
import { Error } from './Error.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const rootElemet = document.getElementById('root');
const queryClient = new QueryClient();

if (rootElemet)
	createRoot(rootElemet).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<App />} errorElement={<Error />} />
						<Route path="event/:eventId" element={<EventPage />} errorElement={<Error key={1} />} />
						<Route path="*" element={<Error />} />
					</Routes>
				</BrowserRouter>
			</QueryClientProvider>
		</StrictMode>
	);
