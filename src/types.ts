export type RouteKey = Function | RegExp | string;
export type Route = {
  path: RouteKey;
  callback: Function;
  onEnter?: Function | Promise<Function> | undefined;
  onBeforeEnter?: Function | Promise<Function> | undefined;
  onLeave?: Function | Promise<Function> | undefined;
};

export type RouterType = 'Hash' | 'History';
