
import { IBasketView} from "../../types";
import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/Component";
import { ICardActions } from "./Card";



export class Basket extends Component<IBasketView>{
    protected _list: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._totalPrice = container.querySelector('.basket__price');
        this._button = container.querySelector('.button');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set totalPrice(totalPrice: number) {
        this.setText(this._totalPrice, formatNumber(totalPrice))
    }
    buttonDisable() {
        this.setDisabled( this._button, true)
    }
}
