import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/models/Users';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  public users: User[] = [];

  ngOnInit() {
    this.apiService.getUsers().subscribe((data) => {
      this.users = data.users;
    });
  }

  isEditing: boolean = false;

  userSelected: User = {} as User;

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  generateId() {
    return (
      (Math.random() + 1).toString(36).substring(4) +
      (Math.random() + 1).toString(36).substring(4)
    );
  }

  addNewUser(userData: Partial<User>) {
    const tempId = this.generateId();

    const newUser: User = {
      id: this.generateId(),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
    };

    this.users.unshift(newUser);

    this.apiService.addUser(newUser).subscribe({
      next: (apiResponse) => {
        const index = this.users.findIndex((u) => u.id === tempId);
        if (index !== -1) {
          this.users[index] = apiResponse;
        }
      },
      error: (error) => {
        console.error('Error adding user', error);
        this.users.shift();
      },
    });
  }

  deleteUser(index: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      const userToDelete = this.users[index];

      this.apiService.deleteUser(userToDelete.id).subscribe({
        next: () => {
          this.users.splice(index, 1);
        },
        error: (error) => {
          console.error('Error deleting user', error);
        },
      });
    }
  }

  update() {
    if (this.form.valid) {
      const updatedUser = {
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        email: this.form.value.email!,
      };

      if (this.isEditing && this.userSelected) {
        const userId = this.userSelected.id;
        this.apiService.updateUser(userId, updatedUser).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex((u) => u.id === userId);

            if (index !== -1) {
              this.users[index] = {
                ...this.users[index],
                ...updatedUser,
              };
            }

            this.userSelected = {} as User;
            this.isEditing = false;
            this.form.reset();
          },
          error: (error) => {
            console.error('Error updating user', error);
          },
        });
      } else {
        this.addNewUser(updatedUser);
      }
    }
  }

  cancel() {
    if (
      !this.isEditing &&
      confirm(
        'All unsaved changes will be removed. Are you sure you want to cancel?'
      )
    ) {
      this.users.splice(0, 1);
    }
    this.userSelected = {} as User;
    this.isEditing = false;
    this.form.reset();
  }

  selectUser(user: User) {
    if (Object.keys(this.userSelected).length === 0) {
      this.userSelected = user;
      this.isEditing = true;
      this.form.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }
}
