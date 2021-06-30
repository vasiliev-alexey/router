import { Router } from './Router';
import { Logger } from 'tslog';
import { DEBUG_LEVEL } from './constant';

const log: Logger = new Logger({
  name: 'HistoryRouter',
  minLevel: DEBUG_LEVEL,
});

export class HashRouter extends Router {
  routeStore(routeParam: Record<string, unknown>, url: string): void {
    log.debug('add data to history state');
    history.pushState(routeParam, url, url);
  }
}
