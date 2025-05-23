import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-started-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  template: `<nav class="navbar">
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
      <h2>Cours commencés</h2>
      <ul class="course-list">
        <li *ngFor="let course of startedCourses">
          <h4>{{ course.nom }}</h4>
          <p>{{ course.description }}</p>
          <button (click)="addToFavorites(course)">
            Ajouter aux favoris ❤️
          </button>
          <!-- Bouton Voir Plan ajouté -->
          <button (click)="voirPlan(course)" class="view-plan-btn">
            Voir Plan
          </button>
          <!-- Affichage du plan généré -->
          <div *ngIf="selectedCourseId === course.id && generatedPlan">
            <h5>Plan généré :</h5>
            <pre>{{ generatedPlan }}</pre>
          </div>
        </li>
      </ul>

      <p *ngIf="startedCourses.length === 0">
        Aucun cours commencé pour le moment.
      </p>
    </div>`,
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
        margin: 0 0 10px;
        color: #555;
      }

      .course-list button {
        background-color: #ff4081;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-right: 8px;
      }

      .course-list button:hover {
        background-color: #e91e63;
      }

      /* Style spécifique pour le bouton Voir Plan */
      .view-plan-btn {
        background-color: #1976d2;
      }

      .view-plan-btn:hover {
        background-color: #155a9c;
      }
    `,
  ],
})
export class StartedCoursesComponent implements OnInit {
  startedCourses: any[] = [];
  errorMessage: string = '';
  userId: string = '';
  generatedPlan: string = '';
  selectedCourseId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userId = JSON.parse(user).id;
      this.http
        .get<any>(`http://localhost:8000/cours-commences/${this.userId}`)
        .subscribe({
          next: (res) => {
            if (res && res.cours_commences) {
              this.startedCourses = res.cours_commences;
            } else {
              this.startedCourses = [];
              this.errorMessage = 'Aucun cours trouvé pour cet utilisateur.';
            }
          },
          error: (err) => {
            this.startedCourses = [];
            this.errorMessage = 'Erreur lors du chargement des cours.';
            console.error('Erreur de chargement:', err);
          },
        });
    }
  }

  addToFavorites(course: any): void {
    const favoriData = {
      userId: this.userId,
      coursId: course.id,
      titre: course.nom,
      description: course.description,
    };

    this.http
      .post('http://localhost:8082/api/favoris/ajouter', favoriData, {
        responseType: 'text',
      })
      .subscribe({
        next: (res) => {
          console.log('Favori ajouté avec succès :', res);
          alert(res);
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout aux favoris :', err);
          alert('Erreur lors de l’ajout aux favoris.');
        },
      });
  }

  voirPlan(course: any): void {
    this.generatedPlan = '';
    this.selectedCourseId = course.id;

    this.http
      .post<{ plan: string }>('http://localhost:8000/generate-plan/', {
        title: course.nom,
      })
      .subscribe({
        next: (res) => {
          this.generatedPlan = res.plan;
        },
        error: (err) => {
          console.error('Erreur lors de la génération du plan :', err);
          alert('Erreur lors de la génération du plan.');
        },
      });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
