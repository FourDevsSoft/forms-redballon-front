import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../core/services/alerService/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  constructor(public alertService: AlertService) {}
}
