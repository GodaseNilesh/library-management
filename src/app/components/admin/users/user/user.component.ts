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
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [DatePipe],
})
export class UserComponent {
  allUsers: any = [];
  usersDataSource: any[] = this.allUsers;
  usersDataColumns = [
    { columnDef: 'fullName', header: 'Full Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'role', header: 'User Role' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'lastUpdatedAt', header: 'Last Updated On' },
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

  assignedUsersDataSource: any[] = [];
  assignedUsersDataColumns: any[] = [
    { columnDef: 'fullName', header: 'Full Name' },
    { columnDef: 'action', header: 'Action' },
  ];

  userForm!: FormGroup;
  roleForm!: FormGroup;

  isUserEditable: boolean = false;
  isRoleEditable: boolean = false;
  isLoading: boolean = false;
  searchText: string = '';

  usersList: any = [];
  selectedUsers: string[] = [];
  addedUsers: any[] = [];
  removedUsers: any[] = [];

  filteredUsers = this.usersList.slice();
  userCtrl = new FormControl();
  isEditOpen = false;
  selectedUser: any;
  selectedRole: any;
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
          user.createdOn =
            this.datePipe.transform(
              user.createdOn,
              'dd-MM-yyyy hh:mm a',
              'UTC',
            ) || '';
          user.lastUpdatedAt =
            this.datePipe.transform(
              user.lastUpdatedAt,
              'dd-MM-yyyy hh:mm a',
              'UTC',
            ) || '';
          return user;
        });
        this.totalUsersCount = this.allUsers.length ?? 0;
        this.activeUsersCount = this.allUsers.filter(
          (x: any) => x.status === 'active',
        )?.length;
        this.totalRolesCount = [
          ...new Set(this.allUsers.map((x: any) => x.role)),
        ]?.length;
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

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();
    let filtered = [];
    this.searchText = value;

    if (value !== '') {
      filtered = this.getAllAssignUnassignedUsers().filter((user: any) =>
        Object.values(user).some(
          (val: any) =>
            val !== null && val.toString().toLowerCase().includes(value),
        ),
      );
    } else {
      filtered = this.getAllAssignUnassignedUsers();
    }
    this.assignedUsersDataSource = [...filtered];
  }

  setRolesAndAssignedUsers() {
    const roleCounts: any = {};

    this.allUsers.forEach((user: any) => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });

    const allRoles = ['admin', 'teacher', 'student', 'librarian', 'user'];

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

  goToDetails(row: any) {
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

  removeUser(user: any) {
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

  addUser(user: any) {
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

  openDrawer(type: string, row: any) {
    this.removedUsers = [];
    this.addedUsers = [];
    this.selectedUser = '';
    if (type === 'User') {
      this.selectedUser = row;
      this.userForm.patchValue({
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        userRole: row.role,
        status: row.status,
        userId: row.userId,
      });
    } else {
      this.roleForm.patchValue({
        roleId: row.roleId,
        roleName: row.roleName,
        usersAssigned: row.usersAssigned,
        users: this.usersList,
      });
      this.selectedRole = row;
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
      let isAssigned = user.role === this.selectedRole.roleName;

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
