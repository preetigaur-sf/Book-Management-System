import {Observer} from './observer.interface'

export class AuthObserver implements Observer{
    update(message:string):void
{
    console.log(`[AUTH]:${message}`);
}}