import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-insert-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <h2>Rejoignez-nous</h2>
      <form (ngSubmit)="addUser()">
        <label for="name">Nom complet</label>
        <input [(ngModel)]="user.name" name="name" id="name" required />

        <label for="email">Adresse Email</label>
        <input
          [(ngModel)]="user.email"
          name="email"
          id="email"
          type="email"
          required
        />

        <label for="password">Mot de passe</label>
        <input
          [(ngModel)]="user.password"
          name="password"
          id="password"
          type="password"
          required
        />

        <label for="departement">Département</label>
        <input
          [(ngModel)]="user.departement"
          name="departement"
          id="departement"
          required
        />

        <button type="submit">S'inscrire</button>
      </form>

      <p class="message" *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .form-container {
        max-width: 400px;
        margin: 3rem auto;
        padding: 2rem;
        background-color: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        font-family: 'Segoe UI', sans-serif;
      }

      h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #3f51b5;
      }

      label {
        display: block;
        margin-top: 1rem;
        font-weight: bold;
        color: #333;
      }

      input {
        width: 100%;
        padding: 0.6rem;
        margin-top: 0.4rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      input:focus {
        border-color: #3f51b5;
        outline: none;
      }

      button {
        margin-top: 1.5rem;
        width: 100%;
        padding: 0.8rem;
        background-color: #3f51b5;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button:hover {
        background-color: #2c3e9f;
      }

      .message {
        margin-top: 1rem;
        text-align: center;
        font-weight: bold;
        color: green;
      }
    `,
  ],
})
export class InsertUserComponent {
  user = { name: '', email: '', password: '', departement: '' };
  message = '';

  constructor(private http: HttpClient) {}

  addUser() {
    this.http.post<any>('http://localhost:8000/users', this.user).subscribe({
      next: (res) => {
        this.message = res.message;
        this.user = { name: '', email: '', password: '', departement: '' };
      },
      error: (err) => (this.message = 'Error occurred: ' + err.message),
    });
  }
}
