import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-pop-up',
  imports: [CommonModule],
  templateUrl: './confirm-pop-up.component.html',
  styleUrl: './confirm-pop-up.component.css'
})
export class ConfirmPopUpComponent {

  @Input() message: string = 'Tem certeza que deseja continuar?';
  @Input() visible: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
