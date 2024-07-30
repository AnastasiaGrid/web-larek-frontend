import { ProductsData } from "./components/ProductsData";
import { EventEmitter } from "./components/base/events";
import { Page } from "./components/common/Page";
import { FormErrors, IOrderForm, IProductItem } from "./types"; 
import { API_URL} from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import './scss/styles.scss';
import { Card } from "./components/common/Card";
import { Modal } from "./components/common/Modal";
import { OrderData } from "./components/OrderData";
import { Basket } from "./components/common/Basket";
import { OrderPayment } from "./components/common/Order";
import { Form } from "./components/common/Form";
import { Api } from "./components/base/api";

//Шаблоны
const cardGalleryView = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardFullView = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBusketView = ensureElement<HTMLTemplateElement>('#card-basket');
const basketModal = ensureElement<HTMLTemplateElement>('#basket');
const orderModalForm = ensureElement<HTMLTemplateElement>('#order');
const sucessOrder = ensureElement<HTMLTemplateElement>('#success');
const contactsModalForm  = ensureElement<HTMLTemplateElement>('#contacts');


// Глобальные контейнеры
const events = new EventEmitter();
const api = new Api(API_URL);
const productsData = new ProductsData({}, events)
const orderData = new OrderData({},productsData, events)
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Получаем карточки с сервера
api.get('/product')
    .then((d: { total: number; items: IProductItem[]}) => productsData.setData(d.items))
    .catch(err => {
        console.error(err);
    });


//Вывод всех карточек на страницу
events.on('items:changed', (items) => {
    const cards = items.map(product => {
        const cardItem = new Card('card',cloneTemplate(cardGalleryView),{ onClick: () =>  {
            events.emit('cardModal:open', product.id)
        },})        
        return cardItem.render(product)
    })
    page.catalog = cards
    return 
})


//Открытие модального окна с карточкой
events.on('cardModal:open', (id) => {
    const data = productsData.getModelById(id) 
    const cardPreview = new Card('card',cloneTemplate(cardFullView),{ 
        onClick: () =>  {
            const inBasket = orderData.checkItemInBasket(id)
            if(inBasket) {
                events.emit('basket:delete', id)    
            } else {
                events.emit('basket:add', id) 
            } 
            // после состояние inBasket менняется на противоположное, чтобы вызвать другой текстконтент кнопки
            cardPreview.setTextAddButton(!inBasket)
        } 
    })
    if(data.price === null) {
        cardPreview.buttonDisable()
    }
    cardPreview.setTextAddButton(orderData.checkItemInBasket(id))
    modal.render({content: cardPreview.render(data)})
})

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});


//Добавление товара в корзину
events.on('basket:add', (id) => {
    orderData.toggleOrderedProduct(id)
    page.counter = orderData.getTotalItemsInBasket() 
}) 

//Удаление товара из корзины
events.on('basket:delete', (id) => {
    orderData.toggleOrderedProduct(id)
    page.counter = orderData.getTotalItemsInBasket()
}) 

//Открытие корзины по нажатии на иконку
events.on('basket:open', () => {
    const basket = new Basket(cloneTemplate(basketModal), {
        onClick: () =>  {
            events.emit('order:open')
        } 
    })
        const IdCardsInBasket = orderData.getOrder().items
        //дизейблится кнопка если пустой масссив
        if(IdCardsInBasket.length == 0) {
            basket.buttonDisable()
        } 
        
        const cards = IdCardsInBasket.map(id => {
            const cardData = productsData.getModelById(id)        
            
            const cardItem = new Card('card',cloneTemplate(cardBusketView),{ onClick: () =>  {
                events.emit('basket:delete', id)
                events.emit('basket:open')
            }})
            cardItem.setIndexInBasket(orderData.getIndexInBasket(id))
            return cardItem.render(cardData)
        })
        modal.render({content: basket.render({
            items: cards,
            totalPrice: orderData.getTotal() + ' синапсов'
        })})
    })
    
//Переход по "Оформить заказ" 
events.on('order:open', () => {
        orderFormDelivery.payment = orderData.getOrder().payment ?? 'card'     
        modal.render({content: orderFormDelivery.render()})
    })

//Модалка первой страницы оформления заказа
const orderFormDelivery = new OrderPayment(cloneTemplate(orderModalForm),  {
        onClick: (e) =>  {
            const target = e.target as HTMLButtonElement
            const payment:IOrderForm['payment'] = target.name === 'cash' ? 'cash' : 'card'
            orderFormDelivery.payment = payment  
            events.emit('form:data:change',{
                field: 'payment',
                value: payment,
                formName: 'order'
            } )
       } 
    }, events)



//Изменение формы 
events.on('form:data:change', ({field, value, formName}) => {
    orderData.setOrderData(field,value)
    orderData.validateOrder(formName)
 })   

 //Переход по "Далее" в форме заказа 
 events.on('orderContacts:open', () => {
     modal.render({content: orderFormContacts.render()})
 })

 //Модалка второй страницы оформления заказа
 const orderFormContacts = new Form(cloneTemplate(contactsModalForm),events)


//отправка формы на сервер
events.on('apiPost: send', ()=> {
     api.post('/order', orderData.getOrder(), 'POST')
     .then(data => {
       events.emit('sucessOrder:open')
       orderData.clearBasket()
       page.counter = orderData.getTotalItemsInBasket()
       orderFormContacts.clearForm()
       orderFormDelivery.clearForm()
    })
    .catch(data => {
       alert(data)
     })  
 })
    
// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<FormErrors>, formName) => {  
    const { payment, address, phone, email } = errors;
    switch(formName) {
        case('order'): {
            orderFormDelivery.valid = !payment && !address;
            orderFormDelivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');        
            break
        }
        case('contacts'): {
            orderFormContacts.valid = !email && !phone;  
            orderFormContacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');   
            break
        }      
    }
});

//Модалка успешнного оформления заказа
events.on('sucessOrder:open', () => {
    const sucessModal = new Card('order-success',cloneTemplate(sucessOrder), {onClick: () => {
        modal.close()
    }}) 
    sucessModal.totalPrice = orderData.getTotal()
    modal.render({content: sucessModal.render()})
    
})





