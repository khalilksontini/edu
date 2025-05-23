import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    <div class="profile-container">
      <h2>Mon Profil</h2>
      <div *ngIf="user">
        <p><strong>Nom :</strong> {{ user.name }}</p>
        <p><strong>Email :</strong> {{ user.email }}</p>
        <p><strong>Mot de passe :</strong> {{ user.password }}</p>
        <p><strong>Département :</strong> {{ user.departement }}</p>
      </div>
      <div *ngIf="!user">
        <p>Utilisateur non connecté.</p>
      </div>
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
      .profile-container {
        max-width: 500px;
        margin: 50px auto;
        background: #fff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      h2 {
        margin-bottom: 20px;
        color: #1976d2;
      }

      p {
        font-size: 16px;
        margin: 8px 0;
      }

      strong {
        color: #333;
      }
    `,
  ],
})
export class StudentProfileComponent implements OnInit {
  user: any = null;

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }
  logout() {
    localStorage.removeItem('user');
    // tu peux ajouter un redirect vers la page de login si besoin
  }
}
