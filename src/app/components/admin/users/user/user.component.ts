import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/models/common.model';
import { Role, RolesCount, User } from 'src/app/models/user.model';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [DatePipe],
})
export class UserComponent {
  allUsers: User[] = [];
  usersDataSource: User[] = this.allUsers;
  usersDataColumns = [
    { columnDef: 'fullName', header: 'Full Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'role', header: 'User Role' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'lastUpdatedAt', header: 'Last Updated On' },
    { columnDef: 'action', header: 'Action' },
  ];

  roles: Role[] = [];
  rolesDataSource: Role[] = this.roles;
  rolesDataColumns: { columnDef: string; header: string }[] = [
    { columnDef: 'roleId', header: 'Role ID' },
    { columnDef: 'roleName', header: 'Role Name' },
    { columnDef: 'usersAssigned', header: 'User Assigned' },
    { columnDef: 'action', header: 'Action' },
  ];

  assignedUsersDataSource: User[] = [];
  assignedUsersDataColumns: { columnDef: string; header: string }[] = [
    { columnDef: 'fullName', header: 'Full Name' },
    { columnDef: 'action', header: 'Action' },
  ];

  userForm!: FormGroup;
  roleForm!: FormGroup;

  isUserEditable: boolean = false;
  isRoleEditable: boolean = false;
  isLoading: boolean = false;
  searchText: string = '';

  usersList: string[] = [];
  selectedUsers: string[] = [];
  addedUsers: User[] = [];
  removedUsers: User[] = [];

  filteredUsers = this.usersList.slice();
  userCtrl = new FormControl();
  isEditOpen = false;
  selectedUser!: User | null;
  selectedRole!: Role | null;
  drawerType: string = 'User';

  totalUsersCount: number = 0;
  activeUsersCount: number = 0;
  totalRolesCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private datePipe: DatePipe,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.userForm = this.fb.group({
      userId: new FormControl('', [Validators.required]),
      firstName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      lastName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      email: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      userRole: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
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
      this.filteredUsers = this.usersList.filter((user: string) =>
        user.toLowerCase().includes(value?.toLowerCase()),
      );
    });
  }

  getAllUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.allUsers = users.map((user) => {
          return {
            ...user,
            action: 'edit,delete,details',
            createdOn:
              this.datePipe.transform(
                user.createdOn,
                'dd-MM-yyyy hh:mm a',
                'UTC',
              ) || '',
            lastUpdatedAt:
              this.datePipe.transform(
                user.lastUpdatedAt,
                'dd-MM-yyyy hh:mm a',
                'UTC',
              ) || '',
          };
        });
        this.totalUsersCount = this.allUsers.length ?? 0;
        this.activeUsersCount = this.allUsers.filter(
          (x: User) => x.status === 'active',
        )?.length;
        this.totalRolesCount = [
          ...new Set(this.allUsers.map((x: User) => x.role)),
        ]?.length;
        this.usersList = this.allUsers.map((user: User) => user.fullName);
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

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();
    let filtered = [];
    this.searchText = value;

    if (value !== '') {
      filtered = this.getAllAssignUnassignedUsers().filter((user: User) =>
        Object.values(user).some(
          (val: string | number) =>
            val !== null && val.toString().toLowerCase().includes(value),
        ),
      );
    } else {
      filtered = this.getAllAssignUnassignedUsers();
    }
    this.assignedUsersDataSource = [...filtered];
  }

  setRolesAndAssignedUsers() {
    const roleCounts: RolesCount = {
      admin: 0,
      librarian: 0,
      student: 0,
      teacher: 0,
      user: 0,
    };

    this.allUsers.forEach((user: User) => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });

    const allRoles: UserRole[] = [
      'admin',
      'teacher',
      'student',
      'librarian',
      'user',
    ];

    this.roles = allRoles.map((role, index) => ({
      roleId: index + 1,
      roleName: role,
      usersAssigned: roleCounts[role] || 0,
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

  goToDetails(row: User) {
    if (['librarian', 'admin', 'teacher'].includes(row.role)) {
      this.router.navigate([`/teacher-list/create-teacher/${row.teacherId}`]);
    } else {
      this.router.navigate([`/student-list/create-student/${row.studentId}`]);
    }
  }

  updateData() {
    this.isLoading = true;
    if (this.drawerType === 'User') {
      const userFormData = this.userForm.getRawValue();
      const payload = {
        role: userFormData.userRole,
        status: userFormData.status,
        userId: userFormData.userId,
      };
      this.userService.updateUserById(payload).subscribe(
        (res) => {
          this.closeDrawer();
          this.getAllUsers();
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        },
      );
    } else {
      const roleFormData = this.roleForm.getRawValue();
      const payload = {
        roleName: roleFormData.roleName,
        addedUserIds: this.addedUsers.map((x) => x.userId),
        removedUserIds: this.removedUsers.map((x) => x.userId),
      };
      this.userService.assignManyUsersToRole(payload).subscribe(
        (res) => {
          this.closeDrawer();
          this.getAllUsers();
        },
        (err) => {
          console.error(err);
        },
      );
    }
  }

  removeUser(user: User) {
    this.searchText = '';
    const addedIndex = this.addedUsers.findIndex(
      (u) => u.userId === user.userId,
    );

    if (addedIndex !== -1) {
      this.addedUsers.splice(addedIndex, 1);
    } else {
      this.removedUsers.push(user);
    }
    user.action = 'add';
    this.assignedUsersDataSource = this.getAllAssignUnassignedUsers();
    this.cdr.detectChanges();
  }

  addUser(user: User) {
    this.searchText = '';
    const removedIndex = this.removedUsers.findIndex(
      (u) => u.userId === user.userId,
    );

    if (removedIndex !== -1) {
      this.removedUsers.splice(removedIndex, 1);
    } else {
      this.addedUsers.push(user);
    }
    user.action = 'remove';
    this.assignedUsersDataSource = this.getAllAssignUnassignedUsers();
    this.cdr.detectChanges();
  }

  openDrawer(type: 'User' | 'Role', row: User | Role) {
    this.removedUsers = [];
    this.addedUsers = [];
    this.selectedUser = null;
    this.selectedRole = null;
    if (type === 'User') {
      this.selectedUser = row as User;
      this.userForm.patchValue({
        firstName: this.selectedUser.firstName,
        lastName: this.selectedUser.lastName,
        email: this.selectedUser.email,
        userRole: this.selectedUser.role,
        status: this.selectedUser.status,
        userId: this.selectedUser.userId,
      });
    } else {
      const role = row as Role;
      this.roleForm.patchValue({
        roleId: role.roleId,
        roleName: role.roleName,
        usersAssigned: role.usersAssigned,
        users: this.usersList,
      });
      this.selectedRole = role;
      this.assignedUsersDataSource = this.getAllAssignUnassignedUsers();
    }

    this.drawerType = type;
    this.isEditOpen = true;
    document.querySelector('.users-page')?.classList.add('drawer-active');
  }

  getAllAssignUnassignedUsers() {
    const assignedUsers = [];
    const unAssignedUsers = [];

    for (const user of this.allUsers) {
      let isAssigned = user.role === this.selectedRole?.roleName;

      // Apply pending changes
      if (this.removedUsers.some((u) => u.userId === user.userId)) {
        isAssigned = false;
      }
      if (this.addedUsers.some((u) => u.userId === user.userId)) {
        isAssigned = true;
      }

      const row = {
        ...user,
        action: isAssigned ? 'remove' : 'add',
      };

      if (isAssigned) {
        assignedUsers.push(row);
      } else {
        unAssignedUsers.push(row);
      }
    }

    return [...assignedUsers, ...unAssignedUsers];
  }

  closeDrawer() {
    this.isEditOpen = false;
    document.querySelector('.users-page')?.classList.remove('drawer-active');
  }
}
