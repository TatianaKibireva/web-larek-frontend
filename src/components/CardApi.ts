import { ICard } from "../types";
import { API_URL } from "../utils/constants";
import { Api } from "./base/api";



export class CardApi extends Api {

  getProducts(): Promise<ICard[]> {
    return this.get<{ items: ICard[] }>(`/product`).then(data => data.items)
  }

  getProductsItem(id: string): Promise<ICard> {
    return this.get<ICard>(`/product${id}`)
  }

  postOrderProducts(data: Partial<ICard[]>): Promise<ICard[]>{
      return this.post<ICard[]>(`/product`, data, 'POST')
    }
}