import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import User from '../models/User';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  currentUser: User | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      console.log('pass2');
      this.userService.getUserbyId(id).subscribe((user) => {
        if (user) {
          this.currentUser = user;
          console.log(this.currentUser);
          this.form.setValue({
            name: user.name,
            email: user.email,
            password: user.password,
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.currentUser) {
      this.userService
        .updateUser({
          id: this.currentUser.id,
          name: this.form.get('name')!.value,
          email: this.form.get('email')!.value,
          password: this.form.get('password')!.value,
        })
        .subscribe((user) => console.log(user));
    } else {
      console.log('not exists');
      this.userService
        .addUser({
          id: this.userService.increaseID(),
          name: this.form.get('name')!.value,
          email: this.form.get('email')!.value,
          password: this.form.get('password')!.value,
        })
        .subscribe((user) => console.log(user));
    }

    // this.userService.getUsers().subscribe((users) => console.log(users));
  }
}
