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
			<WipBanner />
			<Routes>
				<Route path='/' element={<ListingsPage />} />
				<Route path='/country/:isoCode' element={<DetailPage />} />
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
