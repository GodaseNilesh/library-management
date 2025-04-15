import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.css'],
})
export class SidenavbarComponent {
  private _formBuilder = inject(FormBuilder);

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });

  //for authors list
  AuthorData = [
    { position: 1, name: 'George Orwell' },
    { position: 2, name: 'Jane Austen' },
    { position: 3, name: 'Mark Twain' },
    { position: 4, name: 'J.K. Rowling' },
    { position: 5, name: 'Ernest Hemingway' },
    { position: 6, name: 'F. Scott Fitzgerald' },
    { position: 7, name: 'Leo Tolstoy' },
    { position: 8, name: 'Agatha Christie' },
    { position: 9, name: 'Stephen King' },
    { position: 10, name: 'Haruki Murakami' },
  ];

  AuthorDataColumns = [
    { columnDef: 'position', header: 'No.' },
    { columnDef: 'name', header: 'Author Name' },
  ];

  authorsDisplayedColumns = this.AuthorDataColumns.map((c) => c.columnDef);
  authorsDataSource = this.AuthorData;

  // For books list
  BookData = [
    {
      id: 1,
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian',
      published: 1949,
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Brave New World',
      author: 'Aldous Huxley',
      genre: 'Science Fiction',
      published: 1932,
      rating: 4.4,
    },
    {
      id: 3,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Classic',
      published: 1960,
      rating: 4.9,
    },
    {
      id: 4,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic',
      published: 1925,
      rating: 4.3,
    },
    {
      id: 5,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      published: 1937,
      rating: 4.7,
    },
    {
      id: 6,
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      genre: 'Dystopian',
      published: 1953,
      rating: 4.5,
    },
    {
      id: 7,
      title: 'Moby Dick',
      author: 'Herman Melville',
      genre: 'Adventure',
      published: 1851,
      rating: 4.0,
    },
    {
      id: 8,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      genre: 'Romance',
      published: 1813,
      rating: 4.6,
    },
    {
      id: 9,
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      genre: 'Coming-of-Age',
      published: 1951,
      rating: 4.2,
    },
    {
      id: 10,
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      genre: 'Philosophical Fiction',
      published: 1988,
      rating: 4.7,
    },
  ];

  BookDataColumns = [
    { columnDef: 'id', header: 'ID' },
    { columnDef: 'title', header: 'Title' },
    { columnDef: 'author', header: 'Author' },
    { columnDef: 'genre', header: 'Genre' },
    { columnDef: 'published', header: 'Published' },
    { columnDef: 'rating', header: 'Rating' },
  ];

  booksDisplayedColumns = this.BookDataColumns.map((c) => c.columnDef);
  bookDataSource = this.BookData;
}
