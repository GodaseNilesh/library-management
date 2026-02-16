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
      // className: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      phoneNo: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^\d*$/),
      ]),
      // username: new FormControl('', [Validators.required]),
      // password: new FormControl('', [Validators.required]),
      // confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.teacherId = id;
        this.teacherService.getTeacherById(this.teacherId).subscribe(
          (res: any) => {
            this.teacherForm.patchValue({
              firstName: res.firstName,
              lastName: res.lastName,
              email: res.email,
              department: res.department,
              phoneNo: res.phone,
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
    let requestBody = {
      teacherId: '',
      firstName: this.teacherForm.value.firstName,
      lastName: this.teacherForm.value.lastName,
      email: this.teacherForm.value.email,
      phone: this.teacherForm.value.phoneNo,
      department: this.teacherForm.value.department,
    };
    if (!this.teacherId) {
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
      requestBody.teacherId = this.teacherId;
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
