import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Exams from './Exams/Exams';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Exam from './Exams/Exam';


function App()
{
	return (
		<div className="App">
			<Header />
			<Router>
				<Switch>
					<Route exact path="/" component={Exams} />
					<Route exact path="/exams/:examId" component={Exam} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
