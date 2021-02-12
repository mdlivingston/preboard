import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Exams from './exams/Exams';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Exam from './exams/Exam';
import PrivateRoute from './auth/PrivateRoute'
import ForgotPassword from './auth/ForgotPassword'
import UpdateProfile from './auth/UpdateProfile'
import Signup from "./auth/Signup";
import Profile from "./auth/Profile"
import Login from './auth/Login'
import { AuthProvider } from './context/AuthContext';


function App()
{
	return (
		<div className="App">
			<Router>
				<AuthProvider>
					<Switch>
						<PrivateRoute path="/user" component={Profile}></PrivateRoute>
						<PrivateRoute path="/update-profile" component={UpdateProfile}></PrivateRoute>
						<Route path="/signup" component={Signup} />
						<Route path="/login" component={Login} />
						<Route path="/forgot-password" component={ForgotPassword} />
						<PrivateRoute exact path="/" component={Exams} />
						<PrivateRoute exact path="/exams/:examId" component={Exam} />
					</Switch>
				</AuthProvider>
			</Router>
		</div>
	);
}

export default App;
