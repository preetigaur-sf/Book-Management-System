import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookService } from '../service/book.service';
import { Router } from '@angular/router';

@Component({
 
  selector: 'app-addbook',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addbook.html',
})
export class AddBook {

  bookForm: FormGroup;

  constructor(
    private fb: FormBuilder,    
    private bookservice: BookService, 
    private router: Router          
  ) {

   
    this.bookForm = this.fb.group({

      title: ['', Validators.required],  

      author: ['', Validators.required],  

      isbn: ['', [Validators.required, Validators.minLength(10)]],  

      publication_date: ['', Validators.required],  

      genre: ['', Validators.required],  

      price: [0, [Validators.required, Validators.min(1)]]  

    });
  }


  addbook() {

    
    if (this.bookForm.valid) {

      console.log("Form Data:", this.bookForm.value); 

     
      this.bookservice.addbook(this.bookForm.value).subscribe(() => {

        console.log("Book Added Successfully");

        
        this.router.navigate(['/booklist']);

      });

    } else {

      
      this.bookForm.markAllAsTouched();

    }
  }
}