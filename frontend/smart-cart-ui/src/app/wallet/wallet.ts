import { Component, OnInit } from '@angular/core';
import { WalletService } from '../core/services/wallet.service';

@Component({
  selector: 'app-wallet',
  imports: [],
  templateUrl: './wallet.html',
  styleUrl: './wallet.scss',
})
export class Wallet implements OnInit {
  balance = 0;
  currency = "";
  constructor(private walletService:WalletService){}
  ngOnInit(): void {
    this.walletService.getWallat().subscribe(response =>{
      console.log(response.currency);
      console.log(response.balance);
      this.currency = response.currency;
      this.balance = response.balance;
      
    });
  }
  addMoney(amount:number){
    this.walletService.addMoney(amount).subscribe({
      next:(response)=>{
        this.currency = response.currency;
        this.balance = response.balance;
      }
    });
  }
}
