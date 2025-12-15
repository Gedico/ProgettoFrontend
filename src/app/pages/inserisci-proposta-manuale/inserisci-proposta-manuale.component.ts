import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

import { PropostaService } from '../../services/proposta.service';
import { PropostaManualeRequest } from '../../models/dto/proposta/proposta-manuale-request.dto';

@Component({
  selector: 'app-inserisci-proposta-manuale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: 'inserisci-proposta-manuale.component.html',
  styleUrls: ['inserisci-proposta-manuale.component.css']
})
export class InserisciPropostaManualeComponent implements OnInit {

  form!: FormGroup;
  idInserzione!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private propostaService: PropostaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1️⃣ Leggo l'id inserzione dalla URL
    this.idInserzione = Number(this.route.snapshot.paramMap.get('id'));

    // 2️⃣ Creo il form reactive
    this.form = this.fb.group({
      prezzoProposta: [null, [Validators.required, Validators.min(1)]],
      nomeCliente: ['', Validators.required],
      contattoCliente: ['', Validators.required],
      note: [''],
      dataOfferta: [
        new Date().toISOString().substring(0, 10),
        Validators.required
      ]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const payload: PropostaManualeRequest = this.form.value;

    this.propostaService
      .creaPropostaManuale(this.idInserzione, payload)
      .subscribe({
        next: () => {
          Swal.fire(
            'Successo',
            'Offerta manuale inserita correttamente',
            'success'
          ).then(() => {
            this.router.navigate(['/inserzioni', this.idInserzione]);
          });
        },
        error: (err) => {
          Swal.fire(
            'Errore',
            err?.error?.message || 'Errore durante l’inserimento',
            'error'
          );
        }
      });
  }

  annulla(): void {
    this.router.navigate(['/inserzioni', this.idInserzione]);
  }
}
