import { Component } from '@angular/core';
import { ReportGenerationComponent } from './report-generation/report-generation';

@Component({
  selector: 'app-root',
  imports: [ReportGenerationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}