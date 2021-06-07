export interface Router {
  // конфигурация роутов должна поддерживаться через функции/строки/регулярки
  registerRoute<Route>(p: Route): void;
  // должна поддерживаться передача параметров в хуки роутера

  // реализовать поддержку асинхронных onBeforeEnter, onEnter, onLeave

  // добавить настройку для работы с hash/history api
}
