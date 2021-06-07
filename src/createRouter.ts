import { Router } from './Router';
import { HistoryRouter } from './HistoryRouter';

export function createRouter(): Router {
  return new HistoryRouter();
}
