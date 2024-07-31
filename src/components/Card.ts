import { ICardActions, IProductItem } from "../types";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
export { ICardActions };


export class Card extends Component<IProductItem> {
    protected _description: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _title: HTMLElement;
    protected _category?: HTMLElement;
    protected _price?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _indexInBasket?: HTMLElement;
    protected _totalPrice?: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this._button = container.querySelector(`.${blockName}__button`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._description = container.querySelector(`.${blockName}__description`);
        this._indexInBasket = container.querySelector(`.basket__item-index`)
        this._totalPrice = container.querySelector('.order-success__description-total')
        this._category = container.querySelector(`.${blockName}__category`)

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }
    set totalPrice(value: number) {
        this.setText(this._totalPrice, value)
    }
    set category(value:string) {
        this.setText(this._category, value);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: string) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, value + ' синапсов');
        }
    }

    set image(value: string) {
        this.setImage(this._image, CDN_URL + value, this.title)
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        } 
    }
    setTextAddButton(inBasket: boolean) {
        this.setText(this._button, inBasket ? 'Удалить из корзины' : 'В корзину')
    }
    //устанавливает порядкой номер в корзине
    setIndexInBasket(index: number) {
        this.setText(this._indexInBasket, index.toString())
    } 
    //дизейблим кнопку для бесценного товара
    buttonDisable() {
        this.setDisabled(this._button, true)
    }
}

