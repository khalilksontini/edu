import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fetch-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>All Users</h2>
    <button (click)="fetchUsers()">Refresh</button>
    <ul>
      <li *ngFor="let user of users">
        {{ user.id }} - {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  `,
})
export class FetchUsersComponent {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  fetchUsers() {
    this.http
      .get<any>('http://localhost:8000/users')
      .subscribe((res) => (this.users = res.users || []));
  }
}
