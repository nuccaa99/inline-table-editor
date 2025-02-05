import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/models/Users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private fb: FormBuilder) {}

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

  addUser() {
    this.users.unshift({
      id: '-',
      firstName: '',
      lastName: '',
      email: '',
    });
    this.userSelected = this.users[0];
  }

  deleteUser(index: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users.splice(index, 1);
    }
  }

  update() {
    if (!this.isEditing) {
      this.users[0] = {
        id: this.generateId(),
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        email: this.form.value.email!,
      };
    }
    let index = this.users.map((u) => u.id).indexOf(this.userSelected.id);
    this.users[index] = {
      id: this.userSelected.id,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.form.value.email!,
    };

    this.userSelected = {} as User;
    this.isEditing = false;
    this.form.reset();
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

  users: User[] = [
    {
      id: '67a31d091c54eecfe9dea1ba',
      firstName: 'Elba',
      lastName: 'Smith',
      email: 'elbasmith@nimon.com',
    },
    {
      id: '67a31d09392af9c3adaf6458',
      firstName: 'Rodgers',
      lastName: 'Sherman',
      email: 'rodgerssherman@nimon.com',
    },
    {
      id: '67a31d0974637527cf97bd67',
      firstName: 'Genevieve',
      lastName: 'Blankenship',
      email: 'genevieveblankenship@nimon.com',
    },
    {
      id: '67a31d09b372945704fcfdaa',
      firstName: 'Solomon',
      lastName: 'Farmer',
      email: 'solomonfarmer@nimon.com',
    },
    {
      id: '67a31d0933eaa54ebbd543de',
      firstName: 'Augusta',
      lastName: 'Grant',
      email: 'augustagrant@nimon.com',
    },
    {
      id: '67a31d093b56f55ed18f2aa0',
      firstName: 'Jaclyn',
      lastName: 'Noble',
      email: 'jaclynnoble@nimon.com',
    },
    {
      id: '67a31d09dc96a28ca1135329',
      firstName: 'Rivera',
      lastName: 'Diaz',
      email: 'riveradiaz@nimon.com',
    },
    {
      id: '67a31d0964c3e12c7765981a',
      firstName: 'Frederick',
      lastName: 'Blanchard',
      email: 'frederickblanchard@nimon.com',
    },
  ];
  title = 'inline-table-editor';
}
