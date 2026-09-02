import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Teacher, TeacherResponse } from 'src/app/models/teacher.model';
import { TeacherService } from 'src/app/Services/teacher.service';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.css'],
})
export class CreateTeacherComponent {
  teacherForm!: FormGroup;
  teacherId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService
  ) {
    this.teacherForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, this.customValidator]),
      department: new FormControl('', [Validators.required]),
      phoneNo: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^\d*$/),
      ]),
      employeeId: new FormControl('', [Validators.required]),
      joiningDate: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      password: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.teacherId = id;
        this.teacherService.getTeacherById(this.teacherId).subscribe(
          (res: Teacher) => {
            const teacherInfo = res;
            this.teacherForm.patchValue({
              firstName: teacherInfo.firstName,
              lastName: teacherInfo.lastName,
              email: teacherInfo.email,
              department: teacherInfo.department,
              phoneNo: teacherInfo.phoneNo,
              employeeId: teacherInfo.employeeId,
              joiningDate: teacherInfo.joiningDate,
              designation: teacherInfo.designation,
              status: teacherInfo.status,
              role: teacherInfo.role,
              password: teacherInfo.password
            });
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }

  saveTeacher() {
    const teacherFormValue = this.teacherForm.value;
    let requestBody: Teacher = {
      firstName: teacherFormValue.firstName,
      lastName: teacherFormValue.lastName,
      email: teacherFormValue.email,
      phoneNo: teacherFormValue.phoneNo,
      department: teacherFormValue.department,
      employeeId: teacherFormValue.employeeId,
      joiningDate: teacherFormValue.joiningDate,
      designation: teacherFormValue.designation,
      status: teacherFormValue.status === true,
      role: teacherFormValue.role,
    };
    if (!this.teacherId) {
      requestBody.password = teacherFormValue.password;
      this.teacherService.saveTeacher(requestBody).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['/teacher-list']);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      requestBody.teacherId = Number(this.teacherId);
      this.teacherService.updateTeacherById(requestBody).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['/teacher-list']);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  customValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const errors: ValidationErrors = {};

    if (value) {
      // Check for only lowercase letters (you can skip this if it's not needed for email)
      if (!/^[a-z0-9@.]*$/.test(value)) {
        errors['lowerCaseOnly'] = 'Only lowercase letters, @ and . are allowed';
      }

      // Check for spaces
      if (/\s/.test(value)) {
        errors['noSpaces'] = 'Value must not contain spaces';
      }

      // Check for exactly one @
      const atCount = (value.match(/@/g) || []).length;
      if (atCount !== 1) {
        errors['singleAt'] = 'Email must contain exactly one "@" symbol';
      }

      // Check for gmail.com domain
      if (!value.endsWith('@gmail.com')) {
        errors['gmailOnly'] = 'Email must end with @gmail.com';
      }
    }

    return Object.keys(errors).length ? errors : null;
  }
}
