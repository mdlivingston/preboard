import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Exams from './admin/Exams/Exams';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';


function App()
{
	return (
		<div className="App">
			<Header />
			<Router>
				<Switch>
					<Route exact path="/" component={Exams} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
