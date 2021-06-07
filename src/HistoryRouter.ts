import { Router } from './Router';

export class HistoryRouter implements Router {
  registerRoute<Route>(p: Route): void {
    console.log(p);
  }
}
