import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class WalletService {
    
  constructor(private http: HttpClient) {}
  getWallat() {
    return this.http.get<{
      balance: number;
      currency: string;
    }>('http://localhost:3000/wallet');
  }

  addMoney(amount:number){
    return this.http.post<{
        message:string;
        amount:number;
        currency:string;
        balance:number
    }>('http://localhost:3000/wallet/add-money',{
        amount:amount
    });
  }
}
