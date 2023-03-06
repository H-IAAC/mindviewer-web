import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import App from './components/App';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App}/>
      {/* <Route path="/map" component={Map}/> */}
    </Switch>
  </BrowserRouter>
);

export default withRouter(Routes);