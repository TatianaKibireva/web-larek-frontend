import './scss/styles.scss';
import { Component } from './components/base/Component';
import { EventEmitter, IEvents } from './components/base/events';
import { CardApi } from './components/CardApi';
import { CardModel } from './components/CardModel';
import { ICard, ICatalog } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import _ from 'lodash';
import { CardView } from './components/CardView';
import { ModalPresenter } from './components/ModalPresenter';


class Catalog extends CardModel<ICatalog> implements ICatalog {
  setCards(cards: ICard[] | unknown) {
    // Проверка на массив
    if (!Array.isArray(cards)) {
      this.cards = [];
      return;
    }
    // Обработка карточек
    this.cards = cards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description, 
      category: card.category,
      image: card.image,
      price: card.price
    }));
    this.emitChanges('catalog.cards:changed', { cards: this.cards });
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
const model = new CardModel({cards: []}, events)



// получаем шаблоны
  const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
  const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

  const catalog = new Catalog({cards: []}, events);
  const catalogView = new CatalogView(CardView, cardCatalogTemplate, events);
   new ModalPresenter(events, cardPreviewTemplate);


// Подписываемся на изменения каталога
    events.on<{ cards: ICard[] }>('catalog.cards:changed', (data) => {
      catalogView.cards = data.cards;
    });

    //загружаем данные
    api.getProducts()
      .then(result => {
        if (!Array.isArray(result)) throw new Error('API response is not array');
        catalog.setCards(result);
      })
      .catch(err => {
        catalog.setCards([]);
      });



