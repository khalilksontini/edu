import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <body>
      <div class="container">
        <h1>Bienvenue sur <span class="brand">EduPlatform</span> 📚</h1>
        <p>
          Apprenez à votre rythme. Des centaines de cours pour tous les niveaux.
        </p>
        <div class="buttons">
          <button routerLink="/log">Se connecter</button>
          <button routerLink="/login" class="secondary">S'inscrire</button>
        </div>
      </div>
    </body>
  `,
  styles: [
    `
      html,
      body {
        margin: 0;
        padding: 0;
        height: 100%;
      }

      body {
        background-image: url('https://media.istockphoto.com/id/1033277722/fr/photo/manuels-sur-banc-d%C3%A9cole-en-bois-avec-ardoise.jpg?s=612x612&w=0&k=20&c=a8THU4A8qi1R1akib1nWOeUVin3v4hVk-XrBposA-Ls=');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed; /* (optionnel) pour effet de parallaxe */
        font-family: Arial, sans-serif;
      }
      .container {
        margin: 150px;
        text-align: center;
        padding: 5rem 2rem;
        font-family: Arial, sans-serif;
      }
      .brand {
        color: #3f51b5;
      }
      .buttons {
        margin-top: 2rem;
      }
      button {
        padding: 0.8rem 1.5rem;
        margin: 0 1rem;
        font-size: 1rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        background-color: #3f51b5;
        color: white;
        transition: background-color 0.3s ease;
      }
      button:hover {
        background-color: #2c3e9f;
      }
      .secondary {
        background-color: #eeeeee;
        color: #3f51b5;
      }
      .secondary:hover {
        background-color: #dddddd;
      }
    `,
  ],
})
export class HomeComponent {}
