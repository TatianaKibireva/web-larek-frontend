import { values } from "lodash";
import { ICard } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class CardPreview extends Component<ICard> {
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _text: HTMLElement;
  protected _button: HTMLButtonElement;


  constructor(container: HTMLElement) {
    super(container)

    this._title = ensureElement<HTMLElement>('.card__title', container)
    this._category = ensureElement<HTMLElement>('.card__category', container)
    this._image = ensureElement<HTMLImageElement>('.card__image', container)
    this._price = ensureElement<HTMLElement>('.card__price', container)
    this._text = ensureElement<HTMLElement>('.card__text', container)
    this._button = ensureElement<HTMLButtonElement>('.card__button', container)
  }

  set title(value: string){
    this.setText(this._title, value)
  }

  set category(value: string){
    this.setText(this._category, value)
  }

  set image(value: string){
    this.setImage(this._image, value)
  }

  set price(value: string){
    this.setText(this._price, value)
  }

  set text(value: string){
    this.setText(this._text, value)
  }

  set buttonText(value: string){
    this.setText(this._button, value)
  }

  getContent(): HTMLElement {
    return this.container;
}

}