class BookObserver {

  constructor() {
    this.book=[];
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(message) {

    for(let i=0;i<this.observers.length;i++){
        this.observers[i].update(message);
    }

  }

}

module.exports = BookObserver;

