export type RouteKey = Function | RegExp | string;
export type DataType = Record<string, unknown>;

export type HookFunctionType = (
  url: string,
  data: DataType
) => Promise<void> | void;

export type Route = {
  path: RouteKey;
  callback: (data: DataType) => void;
  onEnter?: HookFunctionType;
  onBeforeEnter?: HookFunctionType;
  onLeave?: HookFunctionType;
};

export type RouterType = 'Hash' | 'History';
