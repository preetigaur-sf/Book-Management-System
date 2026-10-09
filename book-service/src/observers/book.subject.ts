import { Observer } from "./observer.interface";

export class BookSubject{
    private observers:Observer[]=[];

    subscribe(observer:Observer){
        this.observers.push(observer);
    }

    notify(message:string){
        for(let i=0;i<this.observers.length;i++){
            this.observers[i].update(message);
        }
    }
}