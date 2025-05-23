import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="logo">EduApp</div>
      <ul class="nav-links">
        <li><a routerLink="/student-home">Suggestions</a></li>
        <li><a routerLink="/started-courses">Mes Cours</a></li>
        <li><a routerLink="/profile">Profil</a></li>
        <li><a (click)="logout()">Déconnexion</a></li>
      </ul>
    </nav>
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
        margin: 0;
        padding: 0;
      }

      .nav-links li a {
        color: white;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
        cursor: pointer;
      }

      .nav-links li a:hover {
        color: #cce4ff;
      }
    `,
  ],
})
export class StudentNavbarComponent {
  logout() {
    localStorage.removeItem('interestedCourses'); // si besoin
    window.location.href = '/log';
  }
}
