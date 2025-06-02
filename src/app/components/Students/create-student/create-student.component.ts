import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  MinLengthValidator,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { min } from 'rxjs';
import { StudentService } from 'src/app/Services/student.service';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css'],
})
export class CreateStudentComponent implements OnInit {
  studentForm!: FormGroup;
  studentId: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private student: StudentService
  ) {
    this.studentForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, this.customValidator]),
      className: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      phoneNo: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        // Validators.pattern('^[0-9]{10}$'),
        Validators.pattern(/^\d*$/),
      ]),
      // username: new FormControl('', [Validators.required]),
      // password: new FormControl('', [Validators.required]),
      // confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.studentId = id;
        this.student.getStudentById(id).subscribe(
          (res: any) => {
            this.studentForm.patchValue({
              studentId: res.studentId,
              firstName: res.firstName,
              lastName: res.lastName,
              email: res.email,
              className: res.class,
              department: res.department,
              phoneNo: res.phone,
            });
            console.log(this.studentForm.value);
          },
          (error) => {
            console.log(error);
          }
        );
        this.isLoading = false;
      }
    });
  }

  saveStudent() {
    this.isLoading = true;
    if (this.studentId == '') {
      const reqBody = {
        studentId: 0,
        firstName: this.studentForm.value.firstName,
        lastName: this.studentForm.value.lastName,
        email: this.studentForm.value.email,
        class: this.studentForm.value.className,
        department: this.studentForm.value.department,
        phone: this.studentForm.value.phoneNo,
      };
      this.student.saveStudent(reqBody).subscribe(
        (next) => {
          console.log(next);
          this.router.navigate(['/student-list']);
        },
        (error) => {
          console.log(error);
        }
      );
      this.isLoading = false;
    } else {
      console.log(this.studentForm.value);
      const reqBody = {
        studentId: this.studentId || 0,
        firstName: this.studentForm.value.firstName,
        lastName: this.studentForm.value.lastName,
        email: this.studentForm.value.email,
        class: this.studentForm.value.className,
        department: this.studentForm.value.department,
        phone: this.studentForm.value.phoneNo,
      };

      this.student.updateStudentById(reqBody).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['/student-list']);
        },
        (err) => {
          console.log(err);
        }
      );
      this.isLoading = false;
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
