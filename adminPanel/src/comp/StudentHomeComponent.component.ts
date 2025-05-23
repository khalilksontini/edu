import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-student-home',
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
      <h2>Bienvenue</h2>
      <p>Voici des suggestions de formations pour toi :</p>

      <ul class="course-list">
        <li *ngFor="let course of suggestedCourses">
          <h4>{{ course.nom }}</h4>
          <p>{{ course.description }}</p>
          <button (click)="startCourse(course)">Commencer ce cours</button>
        </li>
      </ul>
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

      button {
        color: #1976d2;
        margin: 7px;
        border: 1px solid #1976d2;
        background: transparent;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: #e3f2fd;
      }
    `,
  ],
})
export class StudentHomeComponent implements OnInit {
  suggestedCourses: any[] = [];
  userDepartement: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userDepartement = parsedUser.departement;
      this.loadCourses();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadCourses(): void {
    this.http.get<any>('http://localhost:8000/formations').subscribe({
      next: (res) => {
        this.suggestedCourses = res.formations?.filter(
          (f: any) => f.departement === this.userDepartement
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  startCourse(course: any) {
    const user = localStorage.getItem('user');
    if (!user) {
      return;
    }

    const parsedUser = JSON.parse(user);

    const payload = {
      user_id: parsedUser.id,
      formation_id: course.id,
    };

    this.http.post('http://localhost:8000/commencer-cours', payload).subscribe({
      next: (res: any) => {
        alert(res.message || 'Cours commencé avec succès');
      },
      error: (err) => {
        console.error('Erreur lors du démarrage du cours :', err);
        alert('Erreur lors du démarrage du cours.');
      },
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
