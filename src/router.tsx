import { Routes, Route } from "react-router-dom"
import { Bid } from "./routes/Bid"
import { Exhibit } from "./routes/Exhibit"
import { Home } from "./routes/Home"
import { Notfound } from "./routes/Notfound"

export const Router = () => {
	return (
		<Routes> {/*Routesで囲む*/}
			<Route path="/" element={<Home />} /> {/*RouteにHomeを設定する*/}
			<Route path="bid" element={<Bid />} />
			<Route path="Exhibit" element={<Exhibit />} />
			<Route path="*" element={<Notfound />} />
		</Routes>
	)
}