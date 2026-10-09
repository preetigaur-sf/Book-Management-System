import { model, property } from "@loopback/repository";

@model()
export class PlaceOrderRequest{
    @property({
        type:'string',
        required:true,
    })
    shipping_address:string;
}