import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrapper">
      <label *ngIf="label" [for]="id">{{ label }}</label>
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [(ngModel)]="model"
        class="styled-input"
      />
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin: 0.5rem 0;
    }

    label {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .styled-input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .styled-input:focus {
      border-color: #3f51b5;
      outline: none;
    }
  `]
})
export class InputComponent {
  @Input() model: any;
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() id: string = Math.random().toString(36).substring(2, 15);
}
