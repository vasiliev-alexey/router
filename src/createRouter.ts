import { HashRouter, HistoryRouter, Router } from './Router';
import { RouterType } from './types';

export function createRouter(routerType: RouterType): Router {
  if (routerType == 'Hash') {
    return new HashRouter();
  } else {
    return new HistoryRouter();
  }
}
