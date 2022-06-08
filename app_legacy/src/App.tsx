import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { MainPage, LoginPage, NotFoundPage } from './pages'
import Footer from './components/layout/Footer'

import './App.css'

export default function App() {
	return (
		<HelmetProvider>
			<div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-green-500 to-blue-500">
				<div className="page-content h-max md:h-auto w-screen md:w-auto rounded-none md:rounded-xl absolute z-10 mx-auto p-10 bg-gray-100 text-center shadow-xl">
					<Router>
						<Switch>
							<Route path="/" exact component={MainPage} />
							<Route path="/login" exact component={LoginPage} />
							<Route path="**" component={NotFoundPage} />
						</Switch>
					</Router>
					<Footer />
				</div>
			</div>
		</HelmetProvider>
	)
}
