// Данные товара
export interface IProduct {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number | null;
  description: string;
}

// Товары в корзине
export interface IBasketItem extends IProduct {
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
  getProducts(): Promise<IProduct[]>;
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
  product: IProduct;
  
  // отрисовывает карточку товара на главной странице
  render(): HTMLElement;

}

// Интерфейс отображения детальной информации о товаре в модальном окне
export interface ProductDetailsModal {

  //DOM-элемент детальной информации
  element: HTMLElement;
  // данные товара (категория, наименование, цена, изображение, подробное описание товара)
  product: IProduct;

  // отрисовывает детальную информацию о карточке в модальном окне
  render(): HTMLElement;

}

// Интерфейс отображения содержимого корзины
export interface BasketModal{
 
  // DOM-элемент корзины
  element: HTMLElement;
  // товары в корзине
  items: IBasketItem[];

  // отрисовывает корзину в модальном окне
  render(): HTMLElement;
  // обновляет итоговую сумму
  updateTotal(amount: number): void;

}

// Интерфейс форм выбора оплаты и ввода адреса
export interface Form {

  // DOM-элемент формы выбора оплаты и ввода адреса
  paymentForm: HTMLElement;
  // DOM-элемент формы ввода контактных данных
  contactsForm: HTMLElement;

  // отрисовывает форму оплаты и ввода адреса
  renderPaymentForm(): HTMLElement;
  // отрисовывает форму ввода контактных данных
  renderContactsForm(): HTMLElement;
  // проверяет валидность введенных данных
  validate(): boolean;
}
