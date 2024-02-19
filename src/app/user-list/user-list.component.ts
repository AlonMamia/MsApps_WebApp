import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import User from '../models/User';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  users: User[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => (this.users = users),
      error: (err) => console.error(err),
    });
  }

  onUserSelected(userId: number): void {
    this.router.navigate(['/users', userId]);
  }
  onUserToEditSelected(userId: number): void {
    this.router.navigate(['/users/edit', userId]);
  }

  deleteUser(userId: number): void {
    this.userService
      .deleteUser(userId)
      .subscribe((deletedUser) => {
        console.log(deletedUser)
        this.getUsers()
      });
  }
}
