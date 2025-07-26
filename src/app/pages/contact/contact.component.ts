import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [HeaderComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {
    contactForm!: FormGroup;

    constructor(private fb: FormBuilder) {
        this.contactForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            subject: ['', [Validators.required]],
            message: ['', [Validators.required]],
        });
    }

    ngOnInit() {}

    onSubmit() {
        if (this.contactForm.valid) {
            console.log(this.contactForm.value);
        }
    }
}
