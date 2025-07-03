// Данные товара
export interface ICard {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number | null;
  // text?: string;
  description?: string;
}

export interface ICatalog {
  cards: ICard[]
}

// Товары в корзине
export interface IBasketItem extends ICard {
  quantity: number;
}

// Данные о заказе
export interface IOrder {
  payment: 'online' | 'offline';
  address: string;
  email: string;
  phone: string;
}

// Интерфейс API-клиента
export interface IApiClient {

  // Получить список товаров
  getCards(): Promise<ICard[]>;
  // Отправить заказ
  createOrder(order: IOrder): Promise<{ success: boolean }>;
}

// Интерфейс для отображения модальных окон
export interface IViewModal {

  // корневой DOM-элемент (рамка модального окна)
  container: HTMLElement;
  // содержимое модального окна, которое отображается внутри container (null - если окно закрыто)
  content: HTMLElement | null;

  // открывает модальное окно с переданным контентом
  open(): void;
  // закрывает модальное окно
  close(): void;
  // показывает сообщение об успешном заказе
  renderOrderSuccess(): void; 
}

// Интерфейс отображения карточки товара на главной странице
export interface ProductCard {
 
  // DOM-элемент карточки
  element: HTMLElement;
  // данные товара (категория, наименование, цена, изображение товара)
  card: ICard;
  
  // отрисовывает карточку товара на главной странице
  render(card: ICard): HTMLElement;

}

// Интерфейс отображения детальной информации о товаре в модальном окне
export interface CardDetailsModal {

  //DOM-элемент детальной информации
  element: HTMLElement;
  // данные товара (категория, наименование, цена, изображение, подробное описание товара)
  card: ICard;

  // отрисовывает детальную информацию о карточке в модальном окне
  render(): HTMLElement;

}

// Интерфейс отображения содержимого корзины
export interface BasketModal{
 
  // DOM-элемент корзины
  element: HTMLElement;

  // отрисовывает корзину с переданными элементами
  render(items: IBasketItem[]): HTMLElement;
  // обновляет итоговую сумму
  updateTotal(amount: number): void;

}

// Интерфейс форм выбора оплаты и ввода адреса
export interface PaymentForm {

  // DOM-элемент формы выбора оплаты и ввода адреса
  paymentForm: HTMLElement;

  // отрисовывает форму оплаты и ввода адреса
  render(paymentMethods: PaymentMethodData[], address: string): HTMLElement
}

export interface SuccessModal {
  element: HTMLElement
  getElement(): HTMLElement
  render(totalAmount: number): void 
}

export interface HeaderView {
element: HTMLElement
basketButton: HTMLButtonElement

constructor(): HeaderView
updateBasketCounter(count: number): void
getElement(): HTMLElement
}


export interface MainPageView {
element: HTMLElement

 constructor(): MainPageView
 renderCards(products: ICard[]): void
 getElement(): HTMLElement
}


