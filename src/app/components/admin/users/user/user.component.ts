import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  allUsers:any = [];
  usersDataSource: any[] = this.allUsers;
  usersDataColumns = [
    { columnDef: 'fullName', header: 'User Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'userRole', header: 'User Role' },
    { columnDef: 'action', header: 'Action' },
  ];

  roles: any = [];
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
  isLoading: boolean = false;

  usersList: any = [];
  selectedUsers: string[] = [];
  filteredUsers = this.usersList.slice();
  userCtrl = new FormControl();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
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
      userRole: new FormControl('', [Validators.required]),
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
    this.getAllUsers();
    this.userCtrl.valueChanges.subscribe((value) => {
      this.filteredUsers = this.usersList.filter((user: any) =>
        user.toLowerCase().includes(value?.toLowerCase()),
      );
    });
  }

  getAllUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      (users: any) => {
        this.allUsers = users.map((user: any) => {
          user.action = 'edit,delete,details';
          return user;
        });
        this.usersList = this.allUsers.map((user: any) => user.fullName);
        this.usersDataSource = this.allUsers;
        this.filteredUsers = this.usersList;
        this.setRolesAndAssignedUsers();
      },
      (err) => {
        this.isLoading = false;
        console.error(err);
      },
    );
  }

  setRolesAndAssignedUsers() {
    const roleCounts: any = {};
    this.allUsers.forEach((user: any) => {
      roleCounts[user.userRole] = (roleCounts[user.userRole] || 0) + 1;
    });

    this.roles = Object.keys(roleCounts).map((role, index) => ({
      roleId: index + 1,
      roleName: role,
      usersAssigned: roleCounts[role],
      action: 'edit',
    }));
    this.rolesDataSource = this.roles;
    this.isLoading = false;
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.isRoleEditable = false;
    } else {
      this.isUserEditable = false;
    }
    this.roleForm.reset();
    this.userForm.reset();
  }

  onEditClicked(event: any) {
    if (event.userId) {
      this.isUserEditable = true;
      this.userForm.patchValue({
        userId: event.userId,
        userName: event.fullName,
        email: event.email,
        userRole: event.userRole,
      });
    } else {
      this.isRoleEditable = true;
      this.roleForm.patchValue({
        roleId: event.roleId,
        roleName: event.roleName,
        usersAssigned: event.usersAssigned,
        users: this.usersList,
      });
      this.selectedUsers = this.allUsers
        .filter((user:any) => user.userRole === event.roleName)
        .map((user:any) => user.fullName);
    }
  }

  updateRole() {
    this.isLoading = true;
    const userId = this.userForm.getRawValue()?.userId;
    if (userId) {
      const userFormData = this.userForm.getRawValue();
      const payload = {
        fullName: userFormData.userName,
        email: userFormData.email,
        userRole: userFormData.userRole,
        userId: userFormData.userId,
      };
      this.userService.updateUserById(payload).subscribe(
        (res) => {
          this.getAllUsers();
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        },
      );
    }else{
      const roleFormData = this.roleForm.getRawValue();
      const selectedUserIds = this.selectedUsers.map(
        (name) => this.allUsers.find((u: any) => u.fullName === name)?.userId,
      );
      const payload = {
        roleId: roleFormData.roleName,
        userIds: selectedUserIds,
      };
      this.userService.assignManyUsersToRole(payload).subscribe(
        (res) => {
          this.getAllUsers();
        },
        (err) => {
          console.error(err);
        },
      );
    }
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
    if (
      value &&
      this.usersList.includes(value) &&
      !this.selectedUsers.includes(value)
    ) {
      this.selectedUsers.push(value);
    }
    event.input.value = '';
  }
}
