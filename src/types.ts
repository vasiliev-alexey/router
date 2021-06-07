export type RouteKey = Function | RegExp | string;
export type Route = {
  path: RouteKey;
  onEnter: Function | Promise<Function>;
};

export type RouterType = 'Hash' | 'History';
