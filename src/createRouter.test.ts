import { createRouter } from './createRouter';
import { HashRouter, HistoryRouter } from './Router';

describe('create router  must be function', () => {
  it('type of api test', () => {
    expect(createRouter).toBeInstanceOf(Function);
  });

  it('create router with Hash type test', () => {
    const hashRouter = createRouter('Hash');
    expect(hashRouter).toBeInstanceOf(HashRouter);
  });

  it('create router with History type test', () => {
    const historyRouter = createRouter('History');
    expect(historyRouter).toBeInstanceOf(HistoryRouter);
  });
});
