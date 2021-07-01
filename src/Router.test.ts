import { Route } from './types';
import { HistoryRouter } from './Router';
import { createRouter } from './createRouter';

describe('Router must be class', () => {
  it('constructor test', () => {
    expect(HistoryRouter).toBeInstanceOf(Function);
    expect(new HistoryRouter()).toBeInstanceOf(HistoryRouter);
  });

  it('have method to register route', () => {
    const router = createRouter('History');

    const firstRoute: Route = {
      callback: jest.fn(),
      onEnter: jest.fn(),
      path: '0',
    };
    expect(router.registerRoute(firstRoute)).not.toBeNull();
    expect(router.registerRoute(firstRoute)).toBeInstanceOf(Function);
  });

  it('expect router have method to navigate with String', async () => {
    const router = new HistoryRouter();
    const rnd = `/(${Math.random().toString(10)}`;

    const callBackFunc = jest.fn();
    const firstRoute: Route = {
      callback: callBackFunc,
      onEnter: jest.fn(),
      path: rnd,
    };

    const dummyState = {
      a: Math.random() * 100500,
    };

    router.registerRoute(firstRoute);
    expect(firstRoute.onEnter).not.toHaveBeenCalled();
    expect(callBackFunc).not.toHaveBeenCalled();

    await router.navigate(rnd, dummyState);
    expect(firstRoute.onEnter).toHaveBeenCalledWith(rnd, dummyState);
    expect(callBackFunc).toHaveBeenCalledWith(dummyState);
    expect(callBackFunc).toHaveBeenCalled();
  });

  it('expect router have method to navigate with function', async () => {
    const router = new HistoryRouter();

    const routeFunc = jest.fn().mockReturnValue(true);
    const secondPathFunc = jest.fn().mockReturnValue(true);

    const firstRoute: Route = {
      callback: jest.fn(),
      onEnter: jest.fn(),
      path: routeFunc,
    };
    const secondRoute: Route = {
      callback: jest.fn(),
      onEnter: jest.fn(),
      path: secondPathFunc,
    };

    const firstRouteFunc = router.registerRoute(firstRoute);
    router.registerRoute(secondRoute);
    expect(firstRoute.onEnter).not.toHaveBeenCalled();
    expect(secondRoute.onEnter).not.toHaveBeenCalled();
    await router.navigate('', {});
    expect(firstRoute.onEnter).toHaveBeenCalled();
    firstRouteFunc();
    await router.navigate('', {});
    expect(secondRoute.onEnter).toHaveBeenCalled();
  });

  it('expect router have method to navigate with Regex', async () => {
    const router = new HistoryRouter();
    const routeFunc = /^\/\d\d\d$/;
    const firstRoute: Route = {
      callback: jest.fn(),
      onEnter: jest.fn(),
      path: routeFunc,
    };
    router.registerRoute(firstRoute);

    expect(firstRoute.onEnter).not.toHaveBeenCalled();
    await router.navigate('/123', {});
    expect(firstRoute.onEnter).toHaveBeenCalled();
  });

  it('expect router have method to navigate with Promise', async () => {
    let t = jest.fn().mockReturnValue(1);

    const router = new HistoryRouter();
    const routeFunc = /^\/\d\d\d$/;
    const rnd = (Math.random() * 1000 + 100).toFixed(0).substr(0, 3);
    const firstRoute: Route = {
      callback: jest.fn(),
      path: routeFunc,
      onEnter: t,
    };
    router.registerRoute(firstRoute);
    history.pushState({}, 'rnd', '/' + rnd);

    await router.navigate('/111', {});
    expect(t).toHaveBeenCalled();
  });
});
