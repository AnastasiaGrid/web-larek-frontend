import { FormErrors, IOrderForm, IProductInOrder, TFormName, TOrderUserData } from "../types";
import { Model } from "./base/Model";
import _ from 'lodash';
import { ProductsData } from "./ProductsData";
import { IEvents } from "./base/events";

export class OrderData extends Model<IProductInOrder> {
    protected productsData: ProductsData;
    protected formErrors: FormErrors = {};
    protected order: IOrderForm = {
        payment: 'card',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: [],
    }
    constructor(data: Partial<IProductInOrder>, productsData: ProductsData, protected events: IEvents) {
        super(data, events)
        this.productsData = productsData
    }
    
    //устанавливает данные в order
    setOrderData<F extends keyof TOrderUserData>(field: F, value: IOrderForm[F] ) {
        this.order[field] = value            
    }


    getOrder() {
        return this.order
    }

    //Добавляет в массив элементы в соответсвии с параметром inOrder
    toggleOrderedProduct(id: string) {
        const inOrder = this.order.items.includes(id)
        if (inOrder) {
            //Создает массив, исключая все предоставленные значения, используя SameValueZero для сравнения на равенство.
            this.order.items = _.without(this.order.items, id);
        } else {
            //Создает версию массива без дубликатов, используя SameValueZero для сравнения на равенство, в которой сохраняется только первое вхождение каждого элемента.
            this.order.items = _.uniq([...this.order.items, id]);
        }
        
        
    }

    //Возвращет количество элементов в корзине
    getTotalItemsInBasket() {
        return this.order.items.length
    }
    checkItemInBasket(id: string) {
        return this.order.items.some(el => el === id)
    }

    clearBasket() {
        this.order =  {
            payment: 'card',
            email: '',
            phone: '',
            address: '',
            total: 0,
            items: [],
        }
    }
 
    getTotal() {
        const totalPrice = this.order.items.map((id) => this.productsData.getModelById(id).price)
        const result = totalPrice.reduce((a, b) => a + b, 0)
        this.order.total = result 
        return result
        
    }

    //возвращает индекс в корзине (порядковый номер)
    getIndexInBasket(id: string) {
        return this.order.items.indexOf(id) + 1
    }

    validateOrder(formName: TFormName) {
        const errors: typeof this.formErrors = {};
        if(formName === 'contacts') {
          if (!this.order.email) {
                errors.email = 'Необходимо указать email';
            }
            if (!this.order.phone) {
                errors.phone = 'Необходимо указать телефон';
            }
    }
       if(formName === 'order') {
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
    }
        this.formErrors = errors;
        this.events.emit('formErrors:change',this.formErrors, formName)
        return Object.keys(errors).length === 0;
    }
    
}