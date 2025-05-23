import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  category: string;
  availability: string;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  template: `
    <nav class="navbar">
      <div class="logo">BookApp</div>
      <ul class="nav-links">
        <li><a routerLink="/student-home">Suggestions</a></li>
        <li><a routerLink="/started-courses">Mes Cours</a></li>
        <li><a routerLink="/favorites">Favoris ❤️</a></li>
        <li><a routerLink="/books" class="active">Books</a></li>
        <li><a routerLink="/profile">Profil</a></li>
        <li><a (click)="logout()">Déconnexion</a></li>
      </ul>
    </nav>

    <div class="books-container">
      <h2>Liste des livres</h2>

      <div class="filters">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          placeholder="Rechercher un livre par titre..."
          class="search-input"
        />

        <select [(ngModel)]="selectedCategory" class="category-select">
          <option value="">Toutes les catégories</option>
          <option *ngFor="let cat of categories" [value]="cat">
            {{ cat }}
          </option>
        </select>

        <input
          type="number"
          [(ngModel)]="maxPrice"
          min="0"
          placeholder="Prix max"
          class="price-input"
        />
      </div>

      <div *ngIf="error" class="error">{{ error }}</div>

      <ul
        *ngIf="books.length > 0 && filterBooks().length > 0; else noBooks"
        class="book-list"
      >
        <li *ngFor="let book of filterBooks()" class="book-item">
          <h4>{{ book.title }}</h4>
          <p><strong>Auteur:</strong> {{ book.author }}</p>
          <p><strong>Catégorie:</strong> {{ book.category }}</p>
          <p><strong>Prix:</strong> {{ book.price }} €</p>
          <p><strong>Disponibilité:</strong> {{ book.availability }}</p>
          <button (click)="getSummary(book.title)">Voir Résumé</button>
          <div *ngIf="summaries[book.title]" class="summary">
            <strong>Résumé:</strong>
            <p>{{ summaries[book.title] }}</p>
          </div>
        </li>
      </ul>

      <ng-template #noBooks>
        <p>Aucun livre trouvé pour ce filtre.</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #1976d2;
        padding: 15px 30px;
        color: white;
      }

      .logo {
        font-size: 20px;
        font-weight: bold;
      }

      .nav-links {
        list-style: none;
        display: flex;
        gap: 20px;
      }

      .nav-links li a {
        color: white;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
      }

      .nav-links li a.active,
      .nav-links li a:hover {
        color: #cce4ff;
      }

      .books-container {
        max-width: 700px;
        margin: 40px auto;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      h2 {
        color: #333;
      }

      .filters {
        display: flex;
        gap: 12px;
        margin-bottom: 15px;
      }

      .search-input,
      .category-select,
      .price-input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 16px;
        flex: 1;
      }

      .category-select {
        max-width: 200px;
      }

      .price-input {
        max-width: 120px;
      }

      .book-list {
        list-style: none;
        padding: 0;
      }

      .book-item {
        margin: 15px 0;
        padding: 15px;
        border-left: 5px solid #1976d2;
        background: #fff;
        border-radius: 6px;
      }

      .book-item h4 {
        margin: 0 0 5px;
        color: #1976d2;
      }

      .book-item p {
        margin: 2px 0;
        color: #555;
      }

      button {
        margin-top: 8px;
        padding: 6px 12px;
        background-color: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: #145ea8;
      }

      .summary {
        margin-top: 10px;
        padding: 10px;
        background-color: #eef6ff;
        border-left: 4px solid #1976d2;
        border-radius: 4px;
      }

      .error {
        color: red;
        margin-bottom: 15px;
      }
    `,
  ],
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  error: string | null = null;
  summaries: { [title: string]: string } = {};

  searchTerm: string = '';
  selectedCategory: string = '';
  maxPrice: number | null = null;

  categories: string[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.http
      .get<{ books: Book[] }>('http://localhost:8000/recommendations')
      .subscribe({
        next: (res) => {
          this.books = res.books;
          this.error = null;
          this.extractCategories();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des livres', err);
          this.error = 'Impossible de charger la liste des livres.';
        },
      });
  }

  extractCategories(): void {
    // Extraire les catégories uniques des livres
    const cats = this.books.map((b) => b.category);
    this.categories = Array.from(new Set(cats)).sort();
  }

  getSummary(title: string): void {
    this.http
      .get<{ title: string; summary: string }>(
        `http://localhost:8000/books/summary?title=${encodeURIComponent(title)}`
      )
      .subscribe({
        next: (res) => {
          this.summaries[title] = res.summary;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du résumé', err);
          this.summaries[title] = 'Erreur lors de la récupération du résumé.';
        },
      });
  }

  filterBooks(): Book[] {
    const term = this.searchTerm.toLowerCase();

    return this.books.filter((book) => {
      const matchesTitle = book.title.toLowerCase().includes(term);
      const matchesCategory =
        this.selectedCategory === '' || book.category === this.selectedCategory;
      const matchesPrice = this.maxPrice == null || book.price <= this.maxPrice;

      return matchesTitle && matchesCategory && matchesPrice;
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
