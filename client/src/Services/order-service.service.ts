import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDeliveryMethod } from '../Models/deliverymethod';
import { BehaviorSubject, EMPTY, Observable, catchError, concatMap, from, map, of, switchMap, tap } from 'rxjs';
import { IOrder } from '../Models/order';
import { IProduct } from '../Models/product';
import { IOrderItem } from '../Models/orderitem';
import { IOrderDetailed } from '../Models/orderdetailed';
import { ICurrentUser } from '../Models/currentuser';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl: string = 'http://localhost:5064/api/Orders';
  allDeliveryMethods: IDeliveryMethod[] | null = null;
  allDeliveryMethodsBS = new BehaviorSubject<IDeliveryMethod[] | null>(this.allDeliveryMethods);

  constructor(private http: HttpClient) {
    this.getAllDeliveryMethods();
  }

  addDeliveryMethod(deliveryMethod: IDeliveryMethod) {
    this.http.post(this.baseUrl + "/DeliveryMethod/Add", deliveryMethod)
      .subscribe({
        next: (data) => {
          console.log(data);
          },
        error: error => { console.log(error) }
      }
    )
  }

  getAllDeliveryMethods() {
    this.http.get<IDeliveryMethod[] | null>(this.baseUrl + "/DeliveryMethod/GetAllItems")
      .subscribe(data => this.allDeliveryMethodsBS.next(data));
  }

  createOrder(order: IOrder, itemsInCart: Map<IProduct, number>) {
    var data = this.http.post<number>(this.baseUrl + "/Order/Create", order).pipe(map(data => {
      if (data != -1) {
        const orderItems: IOrderItem[] = [];

        itemsInCart.forEach((quantity: number, product: IProduct) => {
          let orderItem: IOrderItem = {
            productId: product.id,
            orderId: data!,
            quantity: quantity
          }

          orderItems.push(orderItem)
        });

        let orderItem$: Observable<IOrderItem> = from(orderItems);
        let processedOrderItems = orderItem$.pipe(
          concatMap(
            orderItem => this.http.post<number>(this.baseUrl + "/OrderItem/Create", orderItem).pipe(
              catchError(error => {
                console.log("error");
                return of(null);
              }),
            )
          ));

        processedOrderItems.subscribe();

        return data;
      }
      return "Bad request";
    }));

    return data;
  }

  getAllOrders(user: ICurrentUser | null): Observable<any>  {

    if (user) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user!.token}`
      })

      let params = new HttpParams();

      if (user.email) {
        params = params.append('email', user.email);
      }

      return this.http.get<IOrderDetailed[]>(this.baseUrl + "/Order/Get",
        { headers: headers, params: params });
    }

    return of(null);
  }
}
