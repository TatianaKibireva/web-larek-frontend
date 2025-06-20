# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Описание проекта

Проект "Web-larek" - это интернет-магазин с товарами для веб-разработчиков. Пользователь может посмотреть каталог товаров на главной странице, добавить товары в корзину и сделать заказ.  Проект реализован на TypeScript и представляет собой SPA (Single Page Application) с использованием API для получения данных о товарах.

Особенности реализации:
 1. Модальные окна закрываются:
    - по клику вне модального окна;
    - по клику на иконку «Закрыть» (крестик).
 2. Кнопка перехода к следующему шагу становится доступна только после выполнения действий на текущей странице (выбора товара, способа оплаты, заполнения данных о покупателе).

Интерфейс можно условно разделить на 3 процесса:
1. Просмотр каталога товаров;
2. Просмотр детальной информации о товаре и добавлние его в корзину;
3. Оформление товара.

## Архитектура проекта (MVP)

Основой системы является класс ProductModel (расположенный в src/components/ProductModel.ts), который инкапсулирует все данные приложения и бизнес-логику работы с ними. Модель содержит данные приложения и методы по работе с ними.

Для уведомления об изменениях используется система событий, реализованная через брокер событий EventEmitter (src/components/base/events.ts). 
Презентеры - служат для обработки пользовательских действий, они подписываются на события от элементов отображения, вызывают соответствующие методы модели и координируют обновление элементов отображения через EventEmitter.

## Слой View

1. Класс ViewModal - общий класс для отображения модальных окон. Так как модальные окна в проекте однотипные, то их общая логика и структура вынесена в абстрактный класс ScreenModal. 
  Поля класса: 
   - container: HTMLElement - корневой DOM-элемент (рамка модального окна)
   - content: HTMLElement | null - содержимое модального окна, которое отображается внутри container (null - если окно закрыто).
   Методы класса:
   - setContent(content: HTMLElement): void - метод для установки контента в модальное окно;
   - open(): void - открывает модальное окно с установленным контентом методом setContent;
   - close(): void - закрывает модальное окно.

2. Класс ProductCard - класс для отображения карточки товара на главной странице.
  Поля класса:
   - element: HTMLElement - DOM-элемент карточки;
  Метод класса:
   - render(product: IProduct): HTMLElement - отрисовывает карточку товара на главной странице.

3. Класс ProductDetailsModal - класс для отображения детальной информации о товаре в модальном окне.
  Поля класса:
    - element: HTMLElement - DOM-элемент детальной информации;
  Методы класса:
   - render(product: IProduct): HTMLElement - отрисовывает детальную информацию о карточке в модальном окне. 

4. Класс BasketModal - класс для отображения содержимого корзины.
  Поля класса:
    - container: HTMLElement - контейнер для списка товаров;
  Методы класса:
   - render(items: IBasketItem[]): HTMLElement - отрисовывает корзину с переданными элементами;
   - updateTotal(amount: number): void - обновляет итоговую сумму.

5. Класс PaymentForm - класс для управления формой выбора оплаты.
  Поля класса:
  - paymentFormElement: HTMLElement - DOM-элемент формы выбора оплаты.
  Методы класса:
  - render(paymentMethods: PaymentMethod[], address: string): HTMLElement - отрисовывает форму оплаты.

6. Класс ContactsForm - класс для управления формой ввода контактных данных.
  Поля класса:
  - contactsForm: HTMLElement - DOM-элемент формы ввода контактных данных.
  Методы класса:
  - render(): HTMLElement - отрисовывает форму ввода контактных данных.

7. Класс SuccessModal - 
  Поля класса:
  - element: HTMLElement - корневой DOM-элемент;
  Методы класса:
  - getElement(): HTMLElement - метод для получения корневого DOM-элемента.
  - render(totalAmount: number): void - отрисовывает контент и открывает окно, totalAmount - сумма списания, которая будет отображена.

8. Класс HeaderView - отвечает за отображение и управление шапкой приложения
  Поля класса:
 - element: HTMLElement - корневой DOM-элемент хедера;
 - basketButton: HTMLButtonElement - кнопка корзины;
  Методы класса:
 - constructor() - конструктор создает структуру шапки;
 - updateBasketCounter(count: number): void - обновляет счетчик товаров в корзине, count - новое количество товаров;
 - getElement(): HTMLElement - возврат корневого элемента шапки для вставки в DOM.

9. Класс MainPageView - отвечает за отображение главной страницы с товарами.
  Поля класса:
 - element: HTMLElement - корневой DOM-элемент главной страницы;
  Методы класса:
 - constructor() - конструктор создает структуру главной страницы;
 - renderProducts(products: IProduct[]): void - отрисовывает список товаров;
 - getElement(): HTMLElement - возвращает корневой элемент главной страницы.

## Слой Model

Модели в проекте представлены классом `ProductModel`, который содержит в себе данные о товарах и логику работы с ними.
Поля:
 - products: IProduct[] - массив товаров на главной странице;
 - basket: IBasketItem[] - массив товаров в корзине;
 - order: IOrder | null - данные заказа.
Методы:
 - validateAddress(): boolean - валидация поля ввода адреса доставки;
 - validateEmail(): boolean - валидация поля ввода email;
 - validatePhone(): boolean - валидация поля ввода номера телефона;
 - setOrderPayment(payment: PaymentMethod, address: string): void - установка данных оплаты/доставки;
 - setOrderContacts(email: string, phone: string): void - установка контактных данных;
 - getProducts(): IProduct[] - возвращает список товаров;
 - getProductById(id: string): IProduct | undefined - возвращает товар по ID;
 - addToBasket(product: IProduct): void - добавляет товар в корзину;
 - removeFromBasket(productId: string): void - удаляет товар из корзины;
 - getBasketItems(): IBasketItem[] - возвращает содержимое корзины;
 - getTotalPrice(): number - считает итоговую сумму;
 - clearBasket(): void - очищает корзину после оформления.

 ## Слой Presenter

В Presenter передаются экземпляры отображения и модели, которые нужно связать. Он выступает посредником, обрабатывая события и координируя работу системы.
Основные события:
 - загрузка списка товаров на главной странице и в корзине;
 - отрисовка главной страницы;
 - открытие подробного описания товара;
 - добавление/удаление из корзины товара;
 - открытие корзины;
 - заполнение форм;
 - успешное оформление заказа.


