// Хорошая практика даже простые типы выносить в алиасы

import { FormErrors, IProductItem, TFormName, TOrderUserData } from "../../types";


interface EventObj {
    'modal:open': () => void;
    'modal:close': () => void;
    'cardModal:open': (id: string) => void;
    'items:changed': (items:IProductItem[]) => void;
    'formErrors:change': (errors?: FormErrors, formName?: TFormName) => void; 
    'basket:add': (id: string) => void;
    'basket:delete': (id: string) => void;
    'basket:open': () => void;
    'order:open': () => void;
    'orderContacts:open': () => void;
    'apiPost: send':() => void
    'form:data:change': (data: {field: keyof TOrderUserData,value: string, formName: TFormName}) => void;
    'sucessOrder:open': () => void;
}

export type AllEventFunctions = EventObj[keyof EventObj]
export type EventName = keyof EventObj;
export type EventData<K extends EventName> = Parameters<EventObj[K]>
export type EventCallback<K extends EventName> = EventObj[K]

export interface IEvents {
    on<K extends EventName,T extends EventObj[K]>(event: K, callback: T): void;
    emit<K extends EventName>(eventName: K, ...data: EventData<K>): void; 
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<AllEventFunctions>>;

    constructor() {
        this._events = new Map<EventName, Set<AllEventFunctions>>();
    }

    /**
     * Установить обработчик на событие
     */
    on<K extends EventName,T extends EventObj[K]>(eventName: K, callback: T) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<T>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Инициировать событие с данными
     */
    emit<K extends EventName>(eventName: K, ...data: EventData<K>) {
        this._events.forEach((subscribers, name) => {
            if (name === eventName) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                subscribers.forEach(callback => callback(...data));
            }
        });
    }
}

