import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ListingsPage from "./pages/listings/page"
import DetailPage from "./pages/details/page"

const WipBanner = () => {
	return (
		<div className='border-b bg-yellow-50 px-4 py-2 text-sm text-yellow-900'>
			🚧 This project is a work in progress. Data and features may change.
		</div>
	)
}

const App = () => {
	return (
		<BrowserRouter>
			<div className='h-dvh overflow-hidden flex flex-col'>
				<WipBanner />

				{/* Routes area takes remaining height and prevents body scroll */}
				<div className='flex-1 min-h-0 overflow-hidden'>
					<Routes>
						<Route path='/' element={<ListingsPage />} />
						<Route
							path='/country/:isoCode'
							element={<DetailPage />}
						/>
						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	)
}

export default App
