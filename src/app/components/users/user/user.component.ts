import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  users = [
    {
      userId: 1,
      username: 'john_doe',
      email: 'john.doe@example.com',
      userType: 'admin',
      action: 'edit',
    },
    {
      userId: 2,
      username: 'emma_smith',
      email: 'emma.smith@example.com',
      userType: 'user',
      action: 'edit',
    },
    {
      userId: 3,
      username: 'rahul_verma',
      email: 'rahul.verma@example.com',
      userType: 'user',
      action: 'edit',
    },
    {
      userId: 4,
      username: 'sophia_jones',
      email: 'sophia.jones@example.com',
      userType: 'admin',
      action: 'edit',
    },
    {
      userId: 5,
      username: 'arjun_kumar',
      email: 'arjun.kumar@example.com',
      userType: 'user',
      action: 'edit',
    },
  ];

  usersDataSource: any[] = this.users;
  usersDataColumns = [
    { columnDef: 'userId', header: 'User ID' },
    { columnDef: 'username', header: 'User Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'userType', header: 'User Role' },
    { columnDef: 'action', header: 'Action' },
  ];

  roles = [
    {
      roleId: 1,
      roleName: 'admin',
      usersAssigned: 2,
      action: 'edit',
    },
    {
      roleId: 2,
      roleName: 'user',
      usersAssigned: 25,
      action: 'edit',
    },
  ];

  rolesDataSource: any[] = this.roles;
  rolesDataColumns: any[] = [
    { columnDef: 'roleId', header: 'Role ID' },
    { columnDef: 'roleName', header: 'Role Name' },
    { columnDef: 'usersAssigned', header: 'User Assigned' },
    { columnDef: 'action', header: 'Action' },
  ];

  userForm!: FormGroup;
  roleForm!: FormGroup;

  isUserEditable: boolean = false;
  isRoleEditable: boolean = false;

  usersList = this.users.map((user)=> user.username);
  selectedUsers: string[] = [];
  filteredUsers = this.usersList.slice(); // copy list
  userCtrl = new FormControl();

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      userId: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      userName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      email: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      userType: new FormControl('', [Validators.required]),
    });

    this.roleForm = this.fb.group({
      roleId: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      roleName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      usersAssigned: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      users: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.userCtrl.valueChanges.subscribe(value => {
      this.filteredUsers = this.usersList.filter(user =>
        user.toLowerCase().includes(value?.toLowerCase())
      );
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.isRoleEditable = false;
    } else {
      this.isUserEditable = false;
    }
  }

  onEditClicked(event: any) {
    if (event.userId) {
      this.isUserEditable = true;
      this.userForm.patchValue({
        userId: event.userId,
        userName: event.username,
        email: event.email,
        userType: event.userType,
      });
    } else {
      this.isRoleEditable = true;
      this.roleForm.patchValue({
        roleId: event.roleId,
        roleName: event.roleName,
        usersAssigned: event.usersAssigned,
        users: this.usersList
      })
    }
  }

  updateRole() {
    console.log(this.userForm.value);
  }
  
  selectUser(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;

    if (!this.selectedUsers.includes(value)) {
      this.selectedUsers.push(value);
    }
    this.userCtrl.setValue('');
  }

  removeUser(user: string) {
    const index = this.selectedUsers.indexOf(user);
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
    }
  }

  addUser(event: any) {
    const value = (event.value || '').trim();
    if (value && this.usersList.includes(value) && !this.selectedUsers.includes(value)) {
      this.selectedUsers.push(value);
    }
    event.input.value = '';
  }
}
