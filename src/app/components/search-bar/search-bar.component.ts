import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import comuniList from '../../../../public/comuni.json'; // JSON dei comuni

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  form: FormGroup;
  mostraFiltriAggiuntivi = false; // toggler per filtri extra
  comuniSuggeriti: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      comune: ['', Validators.required],
      categoria: [''],
      prezzoMin: [null],
      prezzoMax: [null],
      dimensioniMin: [null],
      dimensioniMax: [null],
      numeroStanze: [null],
      ascensore: [false],
      stato: ['']
    });
  }

  ngOnInit(): void {
    // Aggiorna i suggerimenti al cambiare dell'input
    this.form.get('comune')?.valueChanges.subscribe(value => {
      const input = value?.toLowerCase() || '';
      this.comuniSuggeriti = comuniList
        .map(c => c.denominazione_ita)            // estrai il campo del nome
        .filter(c => c.toLowerCase().includes(input))
        .slice(0, 10);                             // massimo 10 suggerimenti
    });
  }


  selezionaComune(comune: string) {
    this.form.get('comune')?.setValue(comune);
    this.comuniSuggeriti = [];
  }

  toggleFiltriAggiuntivi() {
    this.mostraFiltriAggiuntivi = !this.mostraFiltriAggiuntivi;
  }

  onSearch(): void {
    if (this.form.invalid) return;

    // Creo un oggetto con solo i campi definiti
    const queryParams: any = {};
    Object.keys(this.form.value).forEach(key => {
      const value = this.form.value[key];
      if (value !== null && value !== '' && value !== false) {
        queryParams[key] = value;
      }
    });

    this.router.navigate(['/search'], { queryParams });
  }
}

