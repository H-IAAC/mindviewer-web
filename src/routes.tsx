import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import App from './components/App';
import HeatMapComponent from './components/HeatMap/HeatMapComponent';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route path="/heatmap" component={HeatMapComponent}/>
    </Switch>
  </BrowserRouter>
);

export default withRouter(Routes);