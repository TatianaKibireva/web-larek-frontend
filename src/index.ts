import './scss/styles.scss';
import { Component } from './components/base/Component';
import { EventEmitter, IEvents } from './components/base/events';
import { CardApi } from './components/CardApi';
import { CardModel } from './components/CardModel';
import { IBasketItem, ICard, ICatalog } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import _ from 'lodash';
import { CardView } from './components/CardView';
import { ModalPresenter } from './components/ModalPresenter';
import { BasketPresenter } from './components/BasketPresenter';
import { OrderPresenter } from './components/OrderPresenter';

class Catalog extends CardModel<ICatalog> implements ICatalog {
  setCards(cards: ICard[] | unknown) {
    if (!Array.isArray(cards)) { // Проверка на массив
      this.cards = [];
      return;
    }
    this.cards = cards.map(card => ({ // Обработка карточек
      id: card.id,
      title: card.title,
      description: card.description, 
      category: card.category,
      image: card.image,
      price: card.price
    }));
    this.emitChanges('catalog.cards:changed', {cards: this.cards});
  }
}

interface ICardConstructor {
  new (template: HTMLTemplateElement, events: IEvents): Component<ICard>;
}

class CatalogView extends Component<ICatalog> {
  constructor(protected Card: ICardConstructor, protected template: HTMLTemplateElement, protected events: IEvents) {
    super(ensureElement('main.gallery'))
  }
  set cards(cards: ICard[]) {
    const elements = cards.map(card => {
      const cardView = new this.Card(this.template, this.events);
      return cardView.render(card);
    });
    this.container.replaceChildren(...elements);
  } 
}

const events = new EventEmitter()
const api = new CardApi(API_URL)
const cardModel = new CardModel({cards: []}, events)

// получаем шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
const orderTemplate = ensureElement<HTMLTemplateElement>('#order')

// инициализация презентеров
const catalog = new Catalog({cards: []}, events);
const catalogView = new CatalogView(CardView, cardCatalogTemplate, events);
  new ModalPresenter(events, cardModel, cardPreviewTemplate);
  new BasketPresenter(events, basketTemplate);
  new OrderPresenter(events, orderTemplate,cardModel)

// подписываемся на изменения каталога
events.on<{ cards: ICard[] }>('catalog.cards:changed', (data) => {
  catalogView.cards = data.cards;
});

// подписываемся на изменения корзины
events.on('card:add', (event: { card: ICard }) => {
  cardModel.addToBasket({
    id: event.card.id,
    title: event.card.title,
    price: event.card.price,
    category: event.card.category,
    image: event.card.image,
    quantity: 1
  })
})

events.on('card:remove', (event: { id: string }) => {
  cardModel.removeFromBasket(event.id)
})

//загружаем данные
api.getProducts()
  .then(result => {
    const cards = result.map(card => {
      return {
      id: card.id,
      title: card.title,
      description: card.description,
      category: card.category,
      image: card.image, 
      price: card.price
      }
    });
    catalog.setCards(cards);
    cardModel.setCards(cards);
  }
  )
  .catch(err => {
    console.error('Error');
    catalog.setCards([]);
    cardModel.setCards([]);
  });

  //установка счетчика корзины в шапке
  const updateBasketCounter = (count: number) => {
  const counter = ensureElement<HTMLElement>('.header__basket-counter');
  counter.textContent = count.toString();
  };

events.on('basket:changed', (data: { items: IBasketItem[], total: number }) => {
  // Обновляем счетчик товаров
  const totalCount = data.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  updateBasketCounter(totalCount);
  // Обновляем сумму в корзине
  const basketTotal = document.querySelector('.basket__price');
  if (basketTotal) {
    basketTotal.textContent = `${data.total} синапсов`;
  }
});