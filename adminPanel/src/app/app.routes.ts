import { Routes } from '@angular/router';
import { InsertUserComponent } from '../comp/insert-user.component';
import { FetchUsersComponent } from '../comp/fetch-users.component';
import { HomeComponent } from '../comp/home.component';
import { LoginComponent } from '../comp/LoginComponent.component';
import { StudentHomeComponent } from '../comp/StudentHomeComponent.component';
import { InterestedCoursesComponent } from '../comp/interested-courses.component';
import { StartedCoursesComponent } from '../comp/started-courses.component';
import { FavoritesComponent } from '../comp/favorites.component';
import { BooksComponent } from '../comp/books.component';
import { StudentProfileComponent } from '../comp/student-profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: InsertUserComponent },
  { path: 'users', component: FetchUsersComponent },
  { path: 'log', component: LoginComponent },
  { path: 'student-home', component: StudentHomeComponent },
  { path: 'interested-courses', component: InterestedCoursesComponent },
  { path: 'started-courses', component: StartedCoursesComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'books', component: BooksComponent },
  { path: 'profile', component: StudentProfileComponent },
];
