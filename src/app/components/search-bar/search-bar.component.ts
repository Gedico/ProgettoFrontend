import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import comuniList from '../../../../public/comuni.json';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  form: FormGroup;
  mostraFiltriAggiuntivi = false;
  comuniSuggeriti: string[] = [];
  isAutocompleteOpen = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private eRef: ElementRef // Necessario per rilevare il click fuori
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
      piano: ['']
    });
  }

  ngOnInit(): void {
    this.form.get('comune')?.valueChanges.subscribe(value => {
      const input = value?.toLowerCase() || '';
      if (input.length > 0) {
        this.comuniSuggeriti = comuniList
          .map(c => c.denominazione_ita)
          .filter(c => c.toLowerCase().includes(input))
          .slice(0, 10);
        this.isAutocompleteOpen = true;
      } else {
        this.comuniSuggeriti = [];
        this.isAutocompleteOpen = false;
      }
    });
  }

  // Chiude i menu se si clicca fuori dal componente
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.comuniSuggeriti = [];
      this.isAutocompleteOpen = false;
      // Opzionale: puoi decidere se chiudere anche i filtri avanzati
      // this.mostraFiltriAggiuntivi = false;
    }
  }

  // Gestisce il secondo click sull'input
  toggleAutocomplete() {
    if (this.comuniSuggeriti.length > 0) {
      this.comuniSuggeriti = [];
      this.isAutocompleteOpen = false;
    } else {
      // Se c'è già del testo, lo ri-attiviamo per mostrare i suggerimenti
      const val = this.form.get('comune')?.value;
      if (val && val.length > 0) {
        this.form.get('comune')?.setValue(val);
      }
    }
  }

  selezionaComune(comune: string) {
    this.form.get('comune')?.setValue(comune);
    this.comuniSuggeriti = [];
    this.isAutocompleteOpen = false;
  }

  toggleFiltriAggiuntivi() {
    this.mostraFiltriAggiuntivi = !this.mostraFiltriAggiuntivi;
  }

  onSearch(): void {
    if (this.form.invalid) return;

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
