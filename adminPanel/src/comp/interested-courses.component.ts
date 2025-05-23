import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-interested-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="logo">EduApp</div>
      <ul class="nav-links">
        <li><a routerLink="/student-home">Suggestions</a></li>
        <li><a routerLink="/interested-courses">Cours intéressés</a></li>
        <li><a routerLink="/profile">Profil</a></li>
        <li><a routerLink="/log">Déconnexion</a></li>
      </ul>
    </nav>

    <div class="home-container">
      <h2>Cours intéressés</h2>
      <p>Voici les cours que tu as ajoutés :</p>

      <ul class="course-list">
        <li *ngFor="let course of interestedCourses">
          <h4>{{ course.title }}</h4>
          <p>{{ course.description }}</p>
        </li>
      </ul>

      <p *ngIf="interestedCourses.length === 0">
        Aucun cours marqué pour le moment.
      </p>
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

      .home-container {
        max-width: 700px;
        margin: 40px auto;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
      }

      h2 {
        color: #333;
      }

      .course-list {
        list-style: none;
        padding: 0;
      }

      .course-list li {
        margin: 15px 0;
        padding: 15px;
        border-left: 5px solid #1976d2;
        background: #fff;
        border-radius: 6px;
      }

      .course-list h4 {
        margin: 0 0 5px;
        color: #1976d2;
      }

      .course-list p {
        margin: 0;
        color: #555;
      }
    `,
  ],
})
export class InterestedCoursesComponent implements OnInit {
  interestedCourses: any[] = [];

  ngOnInit() {
    const stored = localStorage.getItem('interestedCourses');
    this.interestedCourses = stored ? JSON.parse(stored) : [];
  }
}
