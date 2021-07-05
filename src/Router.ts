import { DataType, HookFunctionType, Route } from './types';
import { Logger } from 'tslog';
import { DEBUG_LEVEL } from './constant';

const log: Logger = new Logger({
  name: 'HistoryRouter',
  minLevel: DEBUG_LEVEL,
});

const hashLogger: Logger = new Logger({
  name: 'HashRouter',
  minLevel: DEBUG_LEVEL,
});
const historyLogger: Logger = new Logger({
  name: 'HistoryRouter',
  minLevel: DEBUG_LEVEL,
});

export abstract class Router {
  private routeTable: Set<Route> = new Set<Route>();

  public registerRoute(p: Route) {
    this.routeTable.add(p);

    return () => {
      return this.routeTable.delete(p);
    };
  }

  private findRoute(pathname: string) {
    log.debug('pathname', pathname, this.routeTable);

    let matched = false;

    for (let route of Array.from(this.routeTable.values())) {
      log.debug('pathname', pathname);
      if (typeof route.path === 'function') {
        matched = route.path(pathname);
        log.debug('Route matched by function', matched);
      } else if (route.path instanceof RegExp) {
        matched = route.path.test(pathname);
        log.debug('Route matched by RegExp', matched);
      } else if (typeof route.path === 'string') {
        log.debug('Route matched by string', matched);
        matched = route.path === pathname;
      } else {
        log.warn('route has unknown  RouteKey');
      }
      if (!matched) {
        continue;
      } else {
        return route;
      }
    }
  }

  abstract routeStore(routeParam: DataType, url: string): void;

  async navigate(url: string, routeParam: DataType): Promise<void> {
    const route = this.findRoute(url);

    if (!route) {
      log.warn('No route found');
      return;
    }

    const prevPath = location.pathname;
    this.routeStore(routeParam, url);

    if (prevPath !== '' && url !== prevPath) {
      log.info('call onLeave');
      await this.callHook('onLeave', route.onLeave, prevPath, routeParam);
    }

    log.debug('call before hooks');
    await this.callHook('onBeforeEnter', route.onBeforeEnter, url, routeParam);
    await this.callHook('onEnter', route.onEnter, url, routeParam);

    log.debug('call callback');
    route.callback(routeParam);
  }

  private async callHook(
    hookName: string,
    hook: HookFunctionType | undefined,
    url: string,
    routeParam: DataType
  ): Promise<void> {
    if (!hook) {
      return;
    }
    log.debug(hookName, ' called');
    await hook(url, routeParam);
  }
}

export class HashRouter extends Router {
  routeStore(routeParam: DataType, url: string): void {
    hashLogger.debug('set browser url with normalize');
    location.href = location.href.replace(/#(.*)$/, '') + '#' + url;
  }
}

export class HistoryRouter extends Router {
  routeStore(routeParam: Record<string, unknown>, url: string): void {
    historyLogger.debug('add data to history state');
    history.pushState(routeParam, url, url);
  }
}
