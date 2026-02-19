import { Author } from "./Author";
import { Category } from "./Category";

export class BaseBook  {
  constructor(
    public title: string,
    public author: Author,
    public isbn: string,
    public publicationDate: string,
    public genre: Category,
    public price: number,
  ) {
    this.age = this.calculateAge();
    this.type = this.determineType();
    this.extraInfo = this.generateExtraInfo();
  }

  calculateAge(): number {
    return (
      new Date().getFullYear() - new Date(this.publicationDate).getFullYear()
    );
  }

  public age: number;
  public type: string;
  public extraInfo: string;

  calculateDiscountPrice(): number {
    return this.price * 0.9;
  }

  private determineType(): string {
    if (this.genre.name === "Technology" || this.genre.name === "Science") {
      return "Educational";
    }
    if (this.genre.name === "Fiction") {
      return "Entertainment";
    }
    return "General";
  }

  private generateExtraInfo(): string {
    if (this.age >= 50) {
      return "Classic Book";
    }
    if (this.price > 500) {
      return "Printed Book";
    }
    return "EBook";
  }
}
