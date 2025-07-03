import { ICard } from "../types"
import { CDN_URL } from "../utils/constants"
import { cloneTemplate, ensureElement } from "../utils/utils"
import { IEvents } from "./base/events"
import { CardPreview } from "./CardPreview"
import { Modal } from "./common/Modal"

export class ModalPresenter {
  private modal: Modal
  private cardPreview: CardPreview
  

  constructor(events: IEvents, previewTemplate: HTMLTemplateElement) {
    //инициализация модального окна
    const modalContainer = ensureElement<HTMLElement>('#modal-container')
    this.modal =  new Modal(modalContainer, events)

    //инициализация компонента детального просмотра карточки товара
    this.cardPreview = new CardPreview(cloneTemplate(previewTemplate))

    //подписка на события
    events.on('card:select', (card: ICard) => this.showCardDetails(card));
  }

    private showCardDetails(card: ICard): void {
      
      // заполним данные карточки товара
      this.cardPreview.title = card.title
      this.cardPreview.category = card.category
      this.cardPreview.image = `${CDN_URL}${card.image}`
      this.cardPreview.price = card.price !== null ? `${card.price} синапсов` : 'Бесценно';
      this.cardPreview.text = card.description
      this.cardPreview.buttonText = 'Добавить в корзину'

      //инициализация контанта и открытие модального окна
      this.modal.content = this.cardPreview.getContent()
      this.modal.open()
    }
  }


  