
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      query: [''],
      citta: [''],
      categoria: [''],
      prezzoMin: [''],
      prezzoMax: [''],
    });
  }

  cerca() {
    const valori = this.form.value;

    this.router.navigate(['/ricerca'], {
      queryParams: {
        query: valori.query || null,
        citta: valori.citta || null,
        categoria: valori.categoria || null,
        prezzoMin: valori.prezzoMin || null,
        prezzoMax: valori.prezzoMax || null,
      }
    });
  }
}
