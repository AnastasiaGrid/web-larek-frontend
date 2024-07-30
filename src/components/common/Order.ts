import { TPaymentType } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { ICardActions } from "./Card";
import { Form } from "./Form";


export class OrderPayment extends Form {
    protected paymentCard: HTMLButtonElement;
    protected paymentCash: HTMLButtonElement;

    constructor(container: HTMLFormElement, actions: ICardActions, events?: IEvents) {
        super(container, events);
        this.paymentCard = ensureElement<HTMLButtonElement>('button[name=card]', this.container);
        this.paymentCash = ensureElement<HTMLButtonElement>('button[name=cash]', this.container);
    
        if(actions.onClick) {
            this.paymentCard.addEventListener('click', actions.onClick);
            this.paymentCash.addEventListener('click', actions.onClick);
        }
    }

    set payment(value: TPaymentType) {  
        this.toggleClass(this.paymentCash, 'button_alt-active', value === 'cash');
        this.toggleClass(this.paymentCard, 'button_alt-active', value === 'card');
    }
}

