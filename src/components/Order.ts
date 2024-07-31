import { TPaymentType } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { ICardActions } from "./Card";
import { Form } from "./common/Form";


export class OrderPayment extends Form {
    protected paymentCard: HTMLButtonElement;
    protected paymentCash: HTMLButtonElement;

    constructor(container: HTMLFormElement, events?: IEvents) {
        super(container, events);
        this.paymentCard = ensureElement<HTMLButtonElement>('button[name=card]', this.container);
        this.paymentCash = ensureElement<HTMLButtonElement>('button[name=cash]', this.container);
    
        
        this.paymentCard.addEventListener('click', (e: Event) => {             
            const target = e.target as HTMLButtonElement;
            this.getPayment(target.name)
            this.onInputChange('payment', target.name);    
        })
        this.paymentCash.addEventListener('click', (e: Event) => {             
            const target = e.target as HTMLButtonElement;
            this.getPayment(target.name)
            this.onInputChange('payment', target.name);  
        })
        
    }

    set payment(value: TPaymentType) {  
        this.toggleClass(this.paymentCash, 'button_alt-active', value === 'cash');
        this.toggleClass(this.paymentCard, 'button_alt-active', value === 'card');
    }
    getPayment(targetName: string) {
        const payment = targetName === 'cash' ? 'cash' : 'card'
        this.payment = payment
        
    }

}
export class OrderContacts extends Form {

    constructor(container: HTMLFormElement, events?: IEvents) {
        super(container, events);
    }

}

