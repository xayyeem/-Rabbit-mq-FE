import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ReportRequest {
  requestId: string;
  reportName: string;
  status: string;
  requestedOn: string;
  completedOn?: string;
  expiresOn?: string;
}

@Component({
  selector: 'app-report-generation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './report-generation.html',
  styleUrl: './report-generation.css'
})
export class ReportGenerationComponent implements OnInit, OnDestroy {

  // Angular proxy will forward /api to .NET API
  private apiUrl = '/api/reports';

  reportName = 'AUCR';
  reportType = 'Excel';
  paymentType = 'Unpaid';

  isGenerating = false;

  requests: ReportRequest[] = [];

  private pollingInterval: ReturnType<typeof setInterval> | undefined;


  constructor(private http: HttpClient) {
  }


  ngOnInit(): void {

    // We will enable this after /requests API is created.
    this.loadRequests();

    this.pollingInterval = setInterval(() => {

      // We will enable polling after /requests API is created.
      // this.loadRequests();

    }, 5000);
  }


  ngOnDestroy(): void {

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }


  generateReport(): void {

  if (!this.reportName.trim()) {
    alert('Please enter report name.');
    return;
  }

  this.isGenerating = true;

  const request = {
    report: {
      batcheIds: 'string',
      licenseeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      agentIds: 'string',
      segmentIds: 'string',
      reportNames: this.reportName,
      reportId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      isZero: true,
      paymentType: this.paymentType,
      reportType: this.reportType,
      isSubTotal: true,
      email: 'string'
    },

    archiveStartDate: '2026-10-03T20:14:12.721Z',

    archiveEndDate: '2026-10-03T20:14:12.722Z',

    userCredentialId:
      '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  };

  console.log('Sending report request:', request);

  this.http.post<any>(
    `${this.apiUrl}/generate`,
    request
  )
  .subscribe({

    next: (response) => {

  console.log(
    'Report queued successfully:',
    response
  );

  this.isGenerating = false;

  alert('Report request queued successfully.');

  // Refresh complete page
  window.location.reload();
},

    error: (error) => {

      console.error(
        'API Error:',
        error
      );

      console.error(
        'Status:',
        error.status
      );

      console.error(
        'Response:',
        error.error
      );

      this.isGenerating = false;

      alert(
        `API Error: ${error.status}`
      );
    }

  });
}


  loadRequests(): void {

    this.http.get<ReportRequest[]>(
      `${this.apiUrl}/requests`
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Report requests:',
          response
        );

        this.requests = response;

      },


      error: (error) => {

        console.error(
          'Unable to load report requests:',
          error
        );

      }

    });
  }


downloadReport(request: ReportRequest): void {
  if (request.status !== 'Completed') {
    return;
  }

  const downloadUrl =
    `${this.apiUrl}/${request.requestId}/download`;

  window.open(downloadUrl, '_blank');
}

}