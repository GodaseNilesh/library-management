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
import { ToastrService } from 'ngx-toastr';
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
  selectedImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private student: StudentService,
    private toastr: ToastrService,
  ) {
    this.studentForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, this.customValidator]),
      className: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      phoneNo: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^\d*$/),
      ]),
      admissionDate: new FormControl('', [Validators.required]),
      yearSemester: new FormControl('', [Validators.required]),
      studentId: new FormControl('', [Validators.required]),
      rollNo: new FormControl(''),
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl(''),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      status: new FormControl('active', [Validators.required]),
      libraryMembershipNo: new FormControl(''),
      bloodGroup: new FormControl(''),
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
            const studentData = res.data;
            this.studentForm.patchValue({
              studentId: studentData.studentId,
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              email: studentData.email,
              className: studentData.className,
              department: studentData.department,
              gender: studentData.gender,
              dob: studentData.dob,
              phoneNo: studentData.phone,
              admissionDate: studentData.admissionDate,
              yearSemester: studentData.yearSemester,
              rollNo: studentData.rollNo,
              addressLine1: studentData.addressLine1,
              addressLine2: studentData.addressLine2,
              state: studentData.state,
              city: studentData.city,
              postalCode: studentData.postalCode,
              status: studentData.status,
              libraryMembershipNo: studentData.libraryMembershipNo,
              bloodGroup: studentData.bloodGroup,
            });
          },
          (error) => {
            console.log(error);
            this.toastr.error('Something went wrong!');
          },
        );
        this.isLoading = false;
      }
      this.isLoading = false;
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
        className: this.studentForm.value.className,
        department: this.studentForm.value.department,
        gender: this.studentForm.value.gender,
        dob: this.studentForm.value.dob,
        phone: this.studentForm.value.phoneNo,
        admissionDate: this.studentForm.value.admissionDate,
        yearSemester: this.studentForm.value.yearSemester,
        rollNo: this.studentForm.value.rollNo,
        addressLine1: this.studentForm.value.addressLine1,
        addressLine2: this.studentForm.value.addressLine2,
        state: this.studentForm.value.state,
        city: this.studentForm.value.city,
        postalCode: this.studentForm.value.postalCode,
        status: this.studentForm.value.status,
        libraryMembershipNo: this.studentForm.value.libraryMembershipNo,
        bloodGroup: this.studentForm.value.bloodGroup,
      };
      this.student.saveStudent(reqBody).subscribe(
        (next) => {
          this.router.navigate(['/student-list']);
        },
        (error) => {
          console.log(error);
        },
      );
      this.isLoading = false;
    } else {
      const reqBody = {
        studentId: this.studentId || 0,
        firstName: this.studentForm.value.firstName,
        lastName: this.studentForm.value.lastName,
        email: this.studentForm.value.email,
        className: this.studentForm.value.className,
        department: this.studentForm.value.department,
        gender: this.studentForm.value.gender,
        dob: this.studentForm.value.dob,
        phone: this.studentForm.value.phoneNo,
        admissionDate: this.studentForm.value.admissionDate,
        yearSemester: this.studentForm.value.yearSemester,
        rollNo: this.studentForm.value.rollNo,
        addressLine1: this.studentForm.value.addressLine1,
        addressLine2: this.studentForm.value.addressLine2,
        state: this.studentForm.value.state,
        city: this.studentForm.value.city,
        postalCode: this.studentForm.value.postalCode,
        status: this.studentForm.value.status,
        libraryMembershipNo: this.studentForm.value.libraryMembershipNo,
        bloodGroup: this.studentForm.value.bloodGroup,
      };

      this.student.updateStudentById(reqBody).subscribe(
        (res) => {
          this.router.navigate(['/student-list']);
        },
        (err) => {
          console.log(err);
          this.toastr.error('Something went wrong!');
        },
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
      this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
