import {Observer} from './observer.interface';

export class NotificationObserver implements Observer {
  update(message: string): void {
    console.log('Notification:', message);
  }
}