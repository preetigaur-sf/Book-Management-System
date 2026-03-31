import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../service/book.service';
import { CommonModule } from '@angular/common';

@Component({
  
  selector: 'app-editbook',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editbook.html',
})
export class Editbook {
  bookForm: FormGroup;
  bookId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookservice: BookService,
    private router: Router,
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', [Validators.required, Validators.minLength(10)]],
      publication_date: ['', Validators.required],
      genre: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("ID:",this.bookId);

    this.bookservice.getBooks().subscribe((data) => {
      
      console.log("All Books:",data);
      const book = data.find((b) => b.id == this.bookId);
      console.log("book found: ",this.bookId);

      if (book) {
        this.bookForm.patchValue(book);
      }
    });
  }

  updatebook() {
    if (this.bookForm.valid) {
      this.bookservice.updatebook(this.bookId, this.bookForm.value).subscribe(() => {
        console.log('Book Updated');

        this.router.navigate(['/booklist']);
      });
    } else {
      this.bookForm.markAllAsTouched();
    }
  }
}
