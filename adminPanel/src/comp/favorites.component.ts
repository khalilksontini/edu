import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  template: `
    <nav class="navbar">
      <div class="logo">EduApp</div>
      <ul class="nav-links">
        <li><a routerLink="/student-home">Suggestions</a></li>
        <li><a routerLink="/started-courses">Mes Cours</a></li>
        <li><a routerLink="/favorites">Favoris ❤️</a></li>
        <li><a routerLink="/books" class="active">Books</a></li>
        <li><a routerLink="/profile">Profil</a></li>
        <li><a (click)="logout()">Déconnexion</a></li>
      </ul>
    </nav>
    <div class="home-container">
      <h2>Mes favoris ❤️</h2>
      <ul class="course-list">
        <li *ngFor="let fav of favoris">
          <h4>{{ fav.titre }}</h4>
          <p>{{ fav.description }}</p>
          <button (click)="removeFavori(fav.userId, fav.coursId)">
            🗑️ Retirer
          </button>
        </li>
      </ul>

      <p *ngIf="favoris.length === 0">Aucun cours favori pour le moment.</p>
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

      .nav-links li a:hover {
        color: #cce4ff;
      }

      .home-container {
        max-width: 700px;
        margin: 40px auto;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .course-list li {
        margin: 15px 0;
        padding: 15px;
        border-left: 5px solid #ff4081;
        background: #fff;
        border-radius: 6px;
      }

      .course-list h4 {
        color: #1976d2;
      }
    `,
  ],
})
export class FavoritesComponent implements OnInit {
  favoris: any[] = [];
  userId: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userId = JSON.parse(user).id;

      this.http
        .get<any[]>(
          `http://localhost:8082/api/favoris/list?userId=${this.userId}`
        )
        .subscribe({
          next: (res) => {
            this.favoris = res;
          },
          error: (err) => {
            console.error('Erreur lors du chargement des favoris :', err);
          },
        });
    }
  }
  removeFavori(userId: string, coursId: string) {
    if (confirm('Voulez-vous vraiment retirer ce favori ?')) {
      this.http
        .delete(`http://localhost:8082/api/favoris/supprimer`, {
          params: {
            userId: userId,
            coursId: coursId,
          },
        })
        .subscribe({
          next: () => {
            this.favoris = this.favoris.filter((f) => f.coursId !== coursId);
            this.loadFavoris();
          },
          error: (err) => {
            console.error('Erreur suppression favori :', err);
          },
        });
    }
  }
  loadFavoris(): void {
    this.http
      .get<any[]>(
        `http://localhost:8082/api/favoris/list?userId=${this.userId}`
      )
      .subscribe({
        next: (res) => {
          this.favoris = res;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des favoris :', err);
        },
      });
  }
  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
