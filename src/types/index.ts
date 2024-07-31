export interface IProductsCatalog {
    total: number;
    items: IProductItem[];
}

export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IProductInOrder{
    items: IProductItem[];
    formErrors: FormErrors;
    order: IOrderForm
}

export interface IOrderForm {
    payment: TPaymentType;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IProductsData {
    items: IProductItem[];

    setData(items: IProductItem[]): void;
    getModelById(id: string): IProductItem | undefined;
}

export interface IBasketView {
    items: HTMLElement[];
    totalPrice: string;
}

export interface IModalData {
    content: HTMLElement;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export type TOrderUserData = Pick <IOrderForm,'payment' | 'address' | 'email' | 'phone'>
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export type TPaymentType = 'card' | 'cash'

export type TFormName =  'contacts' | 'order'

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type EventName = string | RegExp;

export type Subscriber = Function;
