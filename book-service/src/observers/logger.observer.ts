import { Observer } from "./observer.interface";

export class LoggerObserver implements Observer{
    update(message: string): void {
        console.log(`[Logger] ${message}`);
    }
}