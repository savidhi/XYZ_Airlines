import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <p>{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="modal.close(true)">Delete</button>
      <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">Cancel</button>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() title: string = 'Confirm Delete';
  @Input() message: string = 'Are you sure you want to delete this booking?';

  constructor(public modal: NgbActiveModal) {}
}
