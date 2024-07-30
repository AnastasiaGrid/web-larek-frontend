//Работа с данными - Модель
import { IProductItem, IProductsData  } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";


//Модель данных товаров
export class ProductsData extends Model<IProductItem> implements IProductsData{
    items: IProductItem[];
    protected events: IEvents;
    
    setData(items: IProductItem[]): void {
        this.items = items
        this.emitChanges('items:changed', items);
    } 

    getModelById(id: string): IProductItem | undefined {
        return this.items.find(i => i.id === id)
      
    }
}
