import {Observer} from './observer.interface';
import { injectable } from '@loopback/core';
export class NotificationObserver implements Observer {
  update(message: string): void {
    console.log('Notification:', message);
  }
}