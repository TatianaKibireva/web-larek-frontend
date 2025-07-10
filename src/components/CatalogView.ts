import { ICard, ICardConstructor, ICatalog } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class CatalogView extends Component<ICatalog> {
  constructor(
    protected Card: ICardConstructor,
    protected template: HTMLTemplateElement,
    protected events: IEvents
  ) {
    super(ensureElement('main.gallery'));
  }
  set cards(cards: ICard[]) {
    const elements = cards.map((card) => {
      const cardView = new this.Card(this.template, this.events);
      return cardView.render(card);
    });
    this.container.replaceChildren(...elements);
  }
}
