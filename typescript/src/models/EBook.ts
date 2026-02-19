import { BaseBook } from "./BaseBook";
import { IBook } from "./IBook";

export class EBook extends BaseBook {
  fileSizeMB: number;

  constructor(data: IBook, fileSizeMB = 5) {
    super(data, "E-Book");
    this.fileSizeMB = fileSizeMB;
  }

  getExtraInfo(): string {
    return `File Size ${this.fileSizeMB}MB`;
  }
}