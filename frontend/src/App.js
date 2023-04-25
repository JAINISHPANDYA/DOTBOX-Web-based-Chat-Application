import './App.css';
import {Router , Switch, Route } from 'react-router-dom';
import HomeSite from './pages/HomeSite';
import HomePage from './pages/HomePage';
import Signup from './components/Signup';
import Login from './components/Login';
import ChatPage from './pages/ChatPage';
import aboutUs from './pages/aboutUs';
import privacyPage from './pages/PrivacyPage';
import ChatProvider from './context/ChatProvider';
import { createBrowserHistory } from 'history';





function App() {
  const history = createBrowserHistory();
  return (
    <div className="App">
      <ChatProvider>
      <Router history={history}>
        <Switch>
      <Route exact path="/" component={HomeSite} />
      <Route path="/gateway" component={HomePage} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/aboutUs" component={aboutUs} />
      <Route path="/privacy" component={privacyPage} />
      <Route path="/chats" component={ChatPage} />
        </Switch>
      </Router>
      </ChatProvider>
    </div>
  );
}

export default App;
