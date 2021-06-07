import { HistoryRouter } from './HistoryRouter';
import { Route } from './types';
import { resolve } from 'eslint-import-resolver-typescript';

describe('Router must be class', () => {
  it('constructor test', () => {
    expect(HistoryRouter).toBeInstanceOf(Function);
    expect(new HistoryRouter()).toBeInstanceOf(HistoryRouter);
  });

  it('have method to register route', () => {
    const router = new HistoryRouter();

    const firstRoute: Route = {
      onEnter: jest.fn(),
      path: '0',
    };
    expect(router.registerRoute(firstRoute)).not.toBeNull();
    expect(router.registerRoute(firstRoute)).toBeInstanceOf(Function);
  });

  it('expect router have method to navigate with String', () => {
    const router = new HistoryRouter();
    const rnd = `/(${Math.random().toString(10)}`;

    const firstRoute: Route = {
      onEnter: jest.fn(),
      path: rnd,
    };

    history.pushState({}, rnd, rnd);
    router.registerRoute(firstRoute);
    expect(firstRoute.onEnter).not.toHaveBeenCalled();
    router.navigate();
    expect(firstRoute.onEnter).toHaveBeenCalled();
  });

  it('expect router have method to navigate with function', () => {
    const router = new HistoryRouter();

    const routeFunc = jest.fn().mockReturnValue(true);
    const secondPathFunc = jest.fn().mockReturnValue(true);

    const firstRoute: Route = {
      onEnter: jest.fn(),
      path: routeFunc,
    };
    const secondRoute: Route = {
      onEnter: jest.fn(),
      path: secondPathFunc,
    };

    router.registerRoute(firstRoute);
    router.registerRoute(secondRoute);
    expect(firstRoute.onEnter).not.toHaveBeenCalled();
    expect(secondRoute.onEnter).not.toHaveBeenCalled();
    router.navigate();
    expect(firstRoute.onEnter).toHaveBeenCalled();
    router.navigate();
    expect(secondRoute.onEnter).toHaveBeenCalled();
  });

  it('expect router have method to navigate with Regex', () => {
    const router = new HistoryRouter();
    const routeFunc = /^\/\d\d\d$/;
    const rnd = (Math.random() * 1000 + 100).toFixed(0).substr(0, 3);
    const firstRoute: Route = {
      onEnter: jest.fn(),
      path: routeFunc,
    };
    router.registerRoute(firstRoute);
    history.pushState({}, 'rnd', '/' + rnd);
    expect(firstRoute.onEnter).not.toHaveBeenCalled();
    router.navigate();
    expect(firstRoute.onEnter).toHaveBeenCalled();
  });

  it('expect router have method to navigate with Promise', async () => {
    let t = jest.fn();

    const router = new HistoryRouter();
    const routeFunc = /^\/\d\d\d$/;
    const rnd = (Math.random() * 1000 + 100).toFixed(0).substr(0, 3);
    const firstRoute: Route = {
      path: routeFunc,
      onEnter: new Promise((resolve, reject) => {
        console.log('Готово.');
        // Успех в половине случаев.

        resolve(t);
      }),
      //  onEnter: jest.fn().mockImplementationOnce(() => Promise.resolve())
    };
    router.registerRoute(firstRoute);
    history.pushState({}, 'rnd', '/' + rnd);

    await router.navigate();

    expect(t).toHaveBeenCalled();
    //   await sleep(100);
    // expect(firstRoute.onEnter).toHaveBeenCalled();
  });
});
