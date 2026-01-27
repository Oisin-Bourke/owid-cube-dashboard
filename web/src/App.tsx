import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ListingsPage from "./pages/listings/page"
import DetailPage from "./pages/details/page"

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<ListingsPage />} />
				<Route path='/country/:isoCode' element={<DetailPage />} />
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
