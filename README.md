# Проектная работа "Веб-ларек"


https://github.com/AnastasiaGrid/web-larek-frontend.git


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
Интерфейс для описания события клика мыши 

```
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
```
Тип для полей инпутов в формах

```
type TOrderUserData = Pick <IOrderForm,'payment' | 'address' | 'email' | 'phone'>
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
Тип для метода при отправке запроса на сервер

```
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

```
Тип для названия эвентов

```
type EventName = string | RegExp;

```
Тип для описания значения эвента 

```
Subscriber = Function;

```


## Архитектура приложения
Проект реализован с помощью шаблона проектирования MVP (Model-View-Presenter), суть которой в использовании Presenter в качестве посредника между моделью данных(Model) и ее представлении(View)(проис ходит отделение логики от отображения).


### Структура приложения(базовый код)
#### Класс Api
Содержит в себе логику отправки запросов.\
`constructor(baseUrl: string, options: RequestInit = {})` - принимает базовый URL и глобальные опции для формирования запроса на сервер.\
Методы:
- метод `get(uri: string)` принимает URI и выполняет GET запрос, возвращая промис с объектом с сервера 
- метод `post(uri: string, data: object, method: ApiPostMethods = 'POST')` принимает URI, объект с данными для отправки на сервер(переведенный в формат JSON) и метод HTPP-запроса 
- метод `handleResponse<T>(response: Response): Promise<object>` обрабатывает json, приходящий с сервера, и ловит ошибки 

#### Класс Component
Базовый класс наследуется всеми основными классами \
`constructor(protected readonly container: HTMLElement)` - принимает контейнер в виде HTMLElement\
Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` переключает класс, принимает HTMLElement элемент, имя класса и булевое значения для переключения класса
- `setText(element: HTMLElement, value: unknown)` записывает текстовое содержание HTML элемента, принимает HTMLElement элемент и любое значение для вставки
- `setDisable(element: HTMLElement, state: boolean) ` меняет атрибут disable, принимает HTMLElement элемент, и булевое состояние 
- `setImage(element: HTMLImageElement, src: string, alt?: string)` записывает изображение, принимает HTMLElement элемент, ссылку и альтернативный текст для изображения
- `render(data?: Partial<T>): HTMLElement ` возвращает DOM-элемент, принимает HTMLElement элемент

#### Класс EventEmitter
Реализует брокер событий. Класс используется в презентере для обработки событий и в слоях приложения для обработки событий. 
Имплементирует интерфейс IEvents с методами:
- `on<T>(eventName: EventName, callback: (event: T) => void)` устанавливает обработчик на событие (подписка), принимает имя эвента и функцию исполнения
- `emit<T>(eventName: string, data?: T)` принимает имя эвента и опционально данные для колбека


#### Класс Model 
Описывает базовый абстрактный класс для модели данных\
`constructor(data: Partial<T>, protected events: IEvents)` принимает в конструктор данные вариативного типа и евент\
Методы:
- `emitChanges(event: string, payload?: object)` метод на изменение модели данных, принимает эвент и опционально payload



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
` constructor(data: Partial<IProductInOrder>, productsData: ProductsData, protected events: IEvents) ` принимает данные определенного интерфейса(описывающий данные по заказу)\
В полях класса хранятся следующие данные:
- `productsData: ProductsData ` класс модели данных с полным описанием карточки. Нужен для получения данных по id 
- `formErrors: FormErrors = {}` сюда записываюся ошибки заполнения формы
- `order: IOrderForm` здесь хранятся все данные по заказу 
Методы:\
- `setOrderData<F extends keyof TOrderUserData>(field: F, value: IOrderForm[F] )`устанавливает данные в order, принимает поле инпута и значение
- `getOrder()` возвращает объект с данными заказа
- `toggleOrderedProduct(id: string)` удаляет/добавляет товары в корзину, принимает id
- `getTotalItemsInBasket()` возвращет количество элементов в корзине
- `checkItemInBasket(id: string)` проверка на наличие в корзине,принимает id
- `clearBasket()` очистка корзины
- `getTotal() ` подсчет суммы заказа
- `getIndexInBasket(id: string) ` возвращает индекс в корзине (порядковый номер),принимает id
- `validateOrder(formName: TFormName)` валидация формы


### Слой представления
#### Класс Basket
Расширяет класс Component.\
`constructor(container: HTMLElement, actions?: ICardActions) ` принимает контейнер типа HTMLElement и опционально интерфейс, описывающий событие MouseEvent\
Отвечает за отображение корзины. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Свойства:
- `list, totalPrice` HTMLElement элементы отображаемых в корзине
-`button: HTMLButtonElement` кнопка в модалке карточки
Методы:\
- `items(items: HTMLElement[])` сеттер, устанавливает в параметр list добавленные товары 
- `totalPrice(totalPrice: number)` сеттер, записывает сумму заказа
- `buttonDisable()` делает кнопку неактивной

#### Класс Card
Расширяет класс Component.\
`constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions)` принимает название контейнера для поиска элементов в нем,  сам контейнер в виде HTMLElement элемента, и опционально, интерфейс, описывающий событие MouseEvent\
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
`constructor(protected container: HTMLFormElement, events: IEvents)` принимает контейнер формы и событие\
Отвечает за модальные окна заказа. В конструктор класса передается DOM элемент темплейта, что позволяет формировать модальные окна формы разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Свойства:
- `submit: HTMLButtonElement` кнопка сабмита
- `errors: HTMLElement` для отображения ошибок валидации
- `events: IEvents` брокер событий
Методы:
- `onInputChange(field: keyof TOrderUserData, value: string)` на изменение вызывает событие, принимает полу инпута и введенное значение
- `valid(value: boolean)` сеттер на проверку валидации
- `errors(value: string)` сеттер  на отображение ошибок валидации

Методы:
- `render()` возвращает контейнер
- `clearForm()`очистка формы

#### Класс Modal
Расширяет класс Component.\
` constructor(container: HTMLElement, protected events: IEvents)`принимает контейнер HTMLElement элемента и событие \
Реализует модальное окно.\
Поля класса
- `closeButton: HTMLButtonElement` кнопка закрытия модального окна
- `content: HTMLElement` обертка модального окна 

Методы:
- `open()` и `close()` обеспечивают открытие и закрытие окна
- `render(data: IModalData): HTMLElement ` возвращает корневой элемент
- `toggleModal(state: boolean)` меняет класс, принемает булевое значение
- ` handleEscape = (evt: KeyboardEvent)` реализует закрытие модального окна по нажатию на Esc

#### Класс OrderPayment
Расширяет класс Form.\
`constructor( container: HTMLFormElement, events?: IEvents)` принимает контейнер формы, и, опционально,  событие\
Реализует модальное окно заказа при внесении пользователем данных о способе оплаты и адресе.\
Поля класса
- `paymentCard: HTMLButtonElement;` кнопка выбора способа оплаты - картой
- `paymentCash: HTMLButtonElement;` кнопка выбора способа оплаты - при получении

Методы:
- `payment(value: TPaymentType)` сеттер, меняет класс для выбранной кнопки способа оплаты 
- `getPayment(targetName: string) ` для определения нажатой кнопки и передачи в сеттер

#### Класс OrderContacts
Расширяет класс Form.\
`constructor( container: HTMLFormElement, events?: IEvents)` принимает контейнер формы, и, опционально,  событие\
Реализует модальное окно заказа при внесении пользователем данных о емэйле и телефоне.\


#### Класс Page
Расширяет класс Component.\
`constructor( container: HTMLFormElement, events: IEvents)` принимает контейнер формы, и событие\
Реализует отображение главной страницы с карточками (каталог)
Поля класса
- `counter, catalog, wrapper, basket` HTMLElement элементы отображения страницы

Методы:
- `counter(value: number)` сеттер, устанавливает количество товаров в значке корзины, принимает количество товаров
- `catalog(items: HTMLElement[])` сеттер, записывает в HTMLElement обертки каталога товары
- `locked(value: boolean)` сеттер, блокирует прокрутку страницы, принимает булевое значения для передачи в метод toggleClass


### Слой коммуникации
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
    /^order\..*:change/: ({field, value, formName}: {field:keyof TOrderUserData, value: string, formName: TFormName }) => void\
    /^contacts\..*:change/: ({field, value, formName}: {field:keyof TOrderUserData, value: string, formName: TFormName }) => void\
    'order:submit': () => void;\
    'contacts:submit': () => void;\
    'formErrorsDelivery:change': (errors: Partial<FormErrors>) => void\
    'formErrorsContacts:change', (errors: Partial<FormErrors>) => void\
    'sucessOrder:open': () => void;\
