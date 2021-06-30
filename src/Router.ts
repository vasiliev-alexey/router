import { Route, RouteKey } from './types';
import { Logger } from 'tslog';
import { DEBUG_LEVEL } from './constant';

const log: Logger = new Logger({
  name: 'HistoryRouter',
  minLevel: DEBUG_LEVEL,
});

export abstract class Router {
  // конфигурация роутов должна поддерживаться через функции/строки/регулярки
  private routeTable: Set<Route> = new Set<Route>();
  private currentPath: string = '';

  public registerRoute(p: Route) {
    // регистрируем роут в таблице
    this.routeTable.add(p);

    return () => {
      // функция по отписке
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

        log.debug('match func', matched);
      } else if (route.path instanceof RegExp) {
        matched = route.path.test(pathname);
        log.debug('5555555555555555', matched);
      } else if (typeof route.path === 'string') {
        log.debug('4444444444444444', matched);
        matched = route.path === pathname;
      } else {
        log.debug('1111111111111111111111', matched);
      }
      if (!matched) {
        return;
      } else {
        return route;
      }
    }
  }

  abstract routeStore(routeParam: Record<string, unknown>, url: string): void;

  async navigate(
    url: string,
    routeParam: Record<string, unknown>
  ): Promise<void> {
    this.routeStore(routeParam, url);

    const route = this.findRoute(url);

    if (!route) {
      log.warn('np route found');
      return;
    }

    if (this.currentPath !== '' && url !== this.currentPath) {
      log.info('call onLeave');

      if (route.onLeave instanceof Promise) {
        log.debug('onLeave called');
      }
    }

    if (route.onEnter instanceof Promise) {
      log.debug('pppppppppppppppppppppp');
      // route.onEnter.then( ()=> {
      //     log.debug("sss")
      // })

      const asyncFunc = await route.onEnter;
      asyncFunc(url, routeParam);
      log.debug('wwwwwwwwwwww');
    } else {
      log.debug('qqqqqqqqqqqqqqq');
      route.onEnter && route.onEnter(url, routeParam);
    }

    route.callback(routeParam);
  }

  // должна поддерживаться передача параметров в хуки роутера

  // реализовать поддержку асинхронных onBeforeEnter, onEnter, onLeave

  // добавить настройку для работы с hash/history api
}
