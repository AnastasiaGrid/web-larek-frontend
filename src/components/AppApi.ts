import {  IProductsCatalog } from "../types";
import { Api } from "./base/api";

export interface IAuctionAPI {
	getCards(): Promise<IProductsCatalog[]>;
}

export class AppApi extends Api implements IAuctionAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }


	getCards(): Promise<IProductsCatalog[]> {
		return this.get(`/cards`).then((cards: IProductsCatalog[]) => cards);
	}
}