# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемых в приложении
Интерфейс для католога карточек товара, получаемый с сервера

```
interface IProductCatalog {
    total: number;
    items: IProductItem[];
}
```

Интерфейс для карточка товара

```
 interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```

Интерфейс для модель данных, для работы с оформлением заказа
```
  interface IProductInOrder{
    items: IProductItem[];
    formErrors: FormErrors;
    order: IOrderForm
}
```
Интерфейс для пользовательских данные по доставке, отправляемые на север

```
interface IOrderForm {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}
```
Интерфейс для выбранных для заказа товаров

```
interface IProductData {
    items: IProductItem[];

    setData(items: IProductItem[]): void;
    getModelById(id: string): IProductItem | undefined;
}
```
Интерфейс для отображени товара в корзине

```
interface IBasketView {
    items: HTMLElement[];
    totalPrice: string;
}
```
Интерфейс для создания модалки

```
interface IModalData {
    content: HTMLElement;
}
```
Интерфейс для отрисовки страницы

```
interface IPage {
    counter: number;
    catalog: HTMLElement[];
}
```
Интерфейс для валидации

```
interface IFormState {
    valid: boolean;
    errors: string[];
}
```
Тип для данных по заказу(первая форма с доставкой)

```
type TOrderAdressPayment = Pick<IOrderForm, 'payment' | 'address'>
```
Тип для данных по заказу(вторая форма с контактами)

```
type TOrderEmailPhone = Pick<IOrderForm, 'email' | 'phone'>
```
Тип для данных по заказу

```
type TOrderUserData = TOrderAdressPayment & TOrderEmailPhone
```
Тип для данных по для обработки ошибок валидации

```
type FormErrors = Partial<Record<keyof IOrderForm, string>>;
```
Тип для данных по способу оплаты

```
type TPaymentType = 'card' | 'cash'
```
Тип для форм

```
type TFormName =  'contacts' | 'order'

```



## Архитектура приложения
Проект реализован с помощью шаблона проектирования MVP (Model-View-Presenter), суть которой в использовании Presenter в качестве посредника между моделью данных(Model) и ее представлении(View)(проис ходит отделение логики от отображения).


### Структура приложения(базовый код)
#### Класс Api
Содержит в себе логику отправки запросов. В конструктор передается базовый URL адрес и объект опций.
- метод `get` принимает URI и выполняет GET запрос, возвращая промис с объектом с сервера 
- метод `post` принимает URI, объект с данными для отправки на сервер(переведенный в формат JSON) и метод HTPP-запроса 
- метод `handleResponse<T>(response: Response): Promise<object>` обрабатывает json, приходящий с сервера, и ловит ошибки 

#### Класс Component
Базовый класс наследуется всеми основными классами \
Методы:
- `toggleClass` переключает класс
- `setDisable` меняет атрибут disable
- `render` возвращает DOM-элемент 
- `setText(element: HTMLElement, value: unknown)` записывает текстовое содержание HTML элемента 
- `setImage(element: HTMLImageElement, src: string, alt?: string)` записывает изображение 

#### Класс EventEmitter
Реализует брокер событий. Класс используется в презентере для обработки событий и в слоях приложения для обработки событий. 
Имплементирует интерфейс IEvents с методами:
- `on` устанавливает обработчик на событие (подписка) 
- `emit` инициирует событие с данными


#### Класс Model 
Описывает базовый абстрактный класс для модели данных\
Методы:
- `emitChanges` метод на изменение модели данных



### Слой данных
#### Класс ProductsData
Класс отвечает за работу с карточками товаров, именно работа с карточками в каталоге. Наследуется от абстрактого класса Model.\
В полях класса хранятся следующие данные:
- `items: IProductItem[] `массив карточек с сервера ;
- `events: IEvents` брокер событий

Методы:
- `getModelById(id: string): IProductItem | undefined` : возвращает данные карточки по id 
- `setData(items: IProductItem[]): void`: записывает в массив данных карточки из сервера

#### Класс OrderData
Класс отвечает за работу с формой оформления заказа пользователем. \
В полях класса хранятся следующие данные:
- `productsData: ProductsData ` класс модели данных с полным описанием карточки. Нужен для получения данных по id 
- `formErrors: FormErrors = {}` сюда записываюся ошибки заполнения формы
- `order: IOrderForm` здесь хранятся все данные по заказу 
Методы:\
- `setOrderData<F extends keyof TOrderUserData>(field: F, value: IOrderForm[F] )`устанавливает данные в order
- `getOrder()` возвращает объект с данными заказа
- `toggleOrderedProduct(id: string)` удаляет/добавляет товары в корзину
- `getTotalItemsInBasket()` возвращет количество элементов в корзине
- `checkItemInBasket(id: string)` проверка на наличие в корзине
- `clearBasket()` очистка корзины
- `getTotal() ` подсчет суммы заказа
- `getIndexInBasket(id: string) ` возвращает индекс в корзине (порядковый номер)
- `validateOrder(formName: TFormName)` валидация формы


### Слой представления
#### Класс Basket
Расширяет класс Component.\
Отвечает за отображение корзины. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Свойства:
- `list, totalPrice` HTMLElement элементы отображаемых в корзине
-`button: HTMLButtonElement` кнопка в модалке карточки
Методы:\
- `items(items: HTMLElement[])` сеттер, устанавливает в параметр list добавленные товары 
- `totalPrice(totalPrice: number)` сеттер, записывает сумму заказа
-`buttonDisable()` делает кнопку неактивной

#### Класс Card
Расширяет класс Component.
Отвечает за отображение карточки. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Свойства:
-  `description, image, title, category, price,indexInBasket, totalPrice, category ` HTMLElement элементы  карточки для заполнения полей
-`button: HTMLButtonElement` кнопка в модалке карточки
Методы:
- `totalPrice(value: number)` сеттер 
- ` id(value: string)` сеттер 
- `title(value: string)` сеттер 
- `price(value: string)` сеттер 
- `image(value: string)` сеттер 
- `description(value: string | string[])` сеттер 

Методы:\
- `setTextAddButton(inBasket: boolean)` устанавливает текст кнопки 
- `setIndexInBasket(index: number)`устанавливает порядкой номер в корзине
- `buttonDisable()` делает кнопку неактивной

#### Класс Form
Расширяет класс Component\
Отвечает за модальные окна заказа. В конструктор класса передается DOM элемент темплейта, что позволяет формировать модальные окна формы разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Свойства:
- `submit: HTMLButtonElement` кнопка сабмита
- `errors: HTMLElement` для отображения ошибок валидации
- `events: IEvents` брокер событий
Методы:
- `onInputChange(field: keyof TOrderUserData, value: string)` на изменение вызывает событие
- `valid(value: boolean)` сеттер на проверку валидации
- `errors(value: string)` сеттер  на отображение ошибок валидации

Методы:
- `render()` возвращает контейнер
- `clearForm()`очистка формы

#### Класс Modal
Расширяет класс Component.\
Реализует модальное окно. 

Поля класса
- `closeButton: HTMLButtonElement` кнопка закрытия модального окна
- `content: HTMLElement` обертка модального окна 

Методы:
- `open()` и `close()` обеспечивают открытие и закрытие окна
- `render(data: IModalData): HTMLElement ` возвращает корневой элемент

#### Класс OrderPayment
Расширяет класс Form.\
Реализует модальное окно заказа при внесении пользователем данных о способе оплаты и адресе.\
Поля класса
- `paymentCard: HTMLButtonElement;` кнопка выбора способа оплаты - картой
- `paymentCash: HTMLButtonElement;` кнопка выбора способа оплаты - при получении

Методы:
- `payment(value: TPaymentType)` сеттер, меняет класс для выбранной кнопки способа оплаты 

#### Класс Page
Расширяет класс Component.
Реализует отображение главной страницы с карточками (каталог)
Поля класса
- `counter, catalog, wrapper, basket` HTMLElement элементы отображения страницы

Методы:
- `counter(value: number)` сеттер, устанавливает количество товаров в значке корзины
- `catalog(items: HTMLElement[])` сеттер, записывает в HTMLElement обертки каталога товары
- `locked(value: boolean)` сеттер, блокирует прокрутку страницы


### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
    'modal:open': () => void;\
    'modal:close': () => void;\
    'cardModal:open': (id: string) => void;\
    'items:changed': (items:IProductItem[]) => void;\
    'formErrors:change': (errors?: FormErrors, formName?: TFormName) => void; \
    'basket:add': (id: string) => void;\
    'basket:delete': (id: string) => void;\
    'basket:open': () => void;\
    'order:open': () => void;\
    'orderContacts:open': () => void;\
    'apiPost: send':() => void\
    'form:data:change': (data: {field: keyof TOrderUserData,value: string, formName: TFormName}) => void;\
    'sucessOrder:open': () => void;\
