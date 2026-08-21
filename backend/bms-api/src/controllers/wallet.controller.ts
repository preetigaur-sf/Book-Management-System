

import {inject} from '@loopback/core';
import { get, post, requestBody } from '@loopback/rest';


export class WalletController {
    balance$ = 50000;
  constructor() {}
  @get('/wallet')
  async getWallet(){
    return {
        balance$:this.balance$,
        currency:'$'
    };
  }
  @post('/wallet/add-money')
  async addMoney(
    @requestBody()data:{amount:number}
  ){
    this.balance$  =  this.balance$ + data.amount;
    return {
        message:"Money added successfully",
        amount:data.amount ,
        currency:'$',
        balance:this.balance$ , 
    };
  }
}
