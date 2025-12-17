import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-step-dati-inserzione',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-dati-inserzione.component.html',
  styleUrls: ['./step-dati-inserzione.component.css']
})
export class StepDatiInserzioneComponent {

  @Input() datiInserzioneForm!: FormGroup;

  @Output() avanti = new EventEmitter<void>();
  @Output() indietro = new EventEmitter<void>();
  @Output() prezzoInput = new EventEmitter<Event>();
  @Output() prezzoBlur = new EventEmitter<void>();

}

