import './scss/styles.scss';
import { EventEmitter} from './components/base/events';
import { CardApi } from './components/CardApi';
import { CardModel } from './components/CardModel';
import { IBasketItem, ICard, ICatalog } from './types';
import { API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import _ from 'lodash';
import { CardView } from './components/CardView';
import { ModalPresenter } from './components/ModalPresenter';
import { BasketPresenter } from './components/BasketPresenter';
import { OrderPresenter } from './components/OrderPresenter';
import { ContactsPresenter } from './components/ContactPresenter';
import { SuccessPresenter } from './components/SuccessPresenter';
import { CatalogView } from './components/CatalogView';
import { BasketButtonView } from './components/BasketButtonView';

class Catalog extends CardModel<ICatalog> implements ICatalog {
	setCards(cards: ICard[] | unknown) {
		if (!Array.isArray(cards)) {
			// проверка на массив
			this.cards = [];
			return;
		}
		this.cards = cards.map((card) => ({
			// обработка карточек
			id: card.id,
			title: card.title,
			description: card.description,
			category: card.category,
			image: card.image,
			price: card.price,
		}));
		this.emitChanges('catalog.cards:changed', { cards: this.cards });
	}
}

const events = new EventEmitter();
const api = new CardApi(API_URL);
const cardModel = new CardModel({ cards: [] }, events);
const header = new BasketButtonView(ensureElement<HTMLButtonElement>('header.header'), events)

// получаем шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// инициализация презентеров
const catalog = new Catalog({ cards: [] }, events);
const catalogView = new CatalogView(CardView, cardCatalogTemplate, events);
new ModalPresenter(events, cardModel, cardPreviewTemplate);
new BasketPresenter(events, basketTemplate);
new OrderPresenter(events, orderTemplate, cardModel);
new ContactsPresenter(events, contactsTemplate, cardModel);
new SuccessPresenter(events, successTemplate);

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
		quantity: 1,
	});
});

events.on('card:remove', (event: { id: string }) => {
	cardModel.removeFromBasket(event.id);
});

//загружаем данные
api
	.getProducts()
	.then((result) => {
		const cards = result.map((card) => {
			return {
				id: card.id,
				title: card.title,
				description: card.description,
				category: card.category,
				image: card.image,
				price: card.price,
			};
		});
		catalog.setCards(cards);
		cardModel.setCards(cards);
	})
	.catch((err) => {
		console.error(err);
		catalog.setCards([]);
		cardModel.setCards([]);
	});

events.on('basket:changed', (data: { items: IBasketItem[]; total: number }) => {
	const totalCount = data.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
	header.counter = totalCount; 
});
