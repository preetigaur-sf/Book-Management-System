import { Observer } from "./observer.interface";
export class AuthSubject{
    private observers:Observer[]=[];
    subscribe(observer:Observer){
        this.observers.push(observer);
    }

    notify(message:string):void{
        for(let i=0; i<this.observers.length;i++){
            this.observers[i].update(message);
        }
    }
}