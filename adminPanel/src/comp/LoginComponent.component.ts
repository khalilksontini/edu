import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Se connecter</h2>
      <form (ngSubmit)="loginUser()" class="login-form">
        <label for="email">Email</label>
        <input [(ngModel)]="user.email" name="email" type="email" required />

        <label for="password">Mot de passe</label>
        <input
          [(ngModel)]="user.password"
          name="password"
          type="password"
          required
        />

        <button type="submit">Connexion</button>
      </form>
      <p *ngIf="message" class="message">{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 400px;
        margin: 50px auto;
        padding: 30px;
        border-radius: 8px;
        background-color: #f5f5f5;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
      }

      h2 {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
      }

      .login-form {
        display: flex;
        flex-direction: column;
      }

      label {
        margin: 10px 0 5px;
        color: #555;
      }

      input {
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 14px;
      }

      button {
        margin-top: 20px;
        padding: 10px;
        font-size: 16px;
        background-color: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: #1565c0;
      }

      .message {
        margin-top: 15px;
        text-align: center;
        color: #d32f2f;
      }
    `,
  ],
})
export class LoginComponent {
  user = { email: '', password: '' };
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  loginUser() {
    this.http.post<any>('http://localhost:8000/login', this.user).subscribe({
      next: (res) => {
        if (res.user) {
          this.message = res.message || 'Connexion réussie';
          localStorage.setItem('user', JSON.stringify(res.user)); // Important !
          this.router.navigate(['/student-home']);
        } else {
          this.message = res.error || 'Email ou mot de passe incorrect';
        }
      },
      error: (err) => {
        this.message = 'Erreur: ' + (err.error?.error || err.message);
      },
    });
  }
}
