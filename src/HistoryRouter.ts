import { Router } from './Router';
import { Route } from './types';

export class HistoryRouter implements Router {
  private routeTable: Set<Route> = new Set<Route>();

  registerRoute(p: Route) {
    // регистрируем роут в таблице
    this.routeTable.add(p);

    return () => {
      // функция по отписке
      return this.routeTable.delete(p);
    };
  }

  async navigate(): Promise<void> {
    const { pathname } = location;
    let matched = false;

    console.log('pathname', pathname, this.routeTable);

    for (let route of Array.from(this.routeTable.values())) {
      console.log('pathname', pathname);
      if (typeof route.path === 'function') {
        matched = route.path(pathname);

        console.log('match func');
      } else if (route.path instanceof RegExp) {
        matched = route.path.test(pathname);
        console.log('5555555555555555', matched);
      } else if (typeof route.path === 'string') {
        console.log('4444444444444444', matched);
        matched = route.path === pathname;
      } else {
        console.log('1111111111111111111111', matched);
      }
      if (matched) {
        if (route.onEnter instanceof Promise) {
          console.log('pppppppppppppppppppppp');
          // route.onEnter.then( ()=> {
          //     console.log("sss")
          // })
          const asyncFunc = await route.onEnter;
          asyncFunc();
          console.log('wwwwwwwwwwww');
        } else {
          console.log('qqqqqqqqqqqqqqq');
          route.onEnter();
        }
      }
    }
  }

  // console.log("p", p)
  // if (this.routeTable.has(p)) {
  //     let route = this.routeTable.get(p)
  //     console.log("proc", p)
  //     if(!route) {
  //         return;
  //     }
  //
  //     const {pathname} = location;
  //     let matched = false;
  //     if (typeof route.path === "function") {
  //         matched = route.path(pathname);
  //
  //         console.log("match func", p)
  //
  //     } else if (route.path instanceof RegExp) {
  //         matched = route.path.test(pathname);
  //     } else if ( typeof route.path === "string"  ) {
  //         matched = (route.path === pathname);
  //     } else {
  //         console.log("1111111111111111111111", matched)
  //     }
  //
  //     console.log("matched", matched)
  //      if(matched) {
  //          route.onEnter()
  //      }
  //
  // } else {
  //     console.log("not found", p, this.routeTable)
  // }
}
