import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

history.listen(location => {
  // Dispatch action depending on location... 
});

export default history;