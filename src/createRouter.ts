import { Router } from './Router';
import { HistoryRouter } from './HistoryRouter';
import { RouterType } from './types';

export function createRouter(routerType: RouterType): Router | undefined {
  if (routerType == 'Hash') {
    return new HistoryRouter();
  } else {
    return undefined;
  }
}
