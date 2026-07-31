import { Component } from '@angular/core';
import {
  BooksDonutChartOptions,
  IssuedBooksLineChartOptions,
  IssueReturnDueBarChartOptions,
  UserDonutChartOptions,
} from './reportOptions';
import { forkJoin } from 'rxjs';
import { ReportService } from 'src/app/Services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  isLoading: boolean = false;
  summaryData: any;

  public userChartOptions: UserDonutChartOptions = {
    series: [],

    chart: {
      type: 'pie',
      height: 300,
      width: 400,
    },

    labels: ['Student', 'Teacher', 'Librarian', 'Admin', 'User'],

    colors: ['#1574f2', '#10B981', '#15c9f2', '#F59E0B', '#f214af'],

    legend: {
      position: 'bottom',
    },

    dataLabels: {
      enabled: true,
    },

    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  public BooksDonutChartOptions: BooksDonutChartOptions = {
    series: [],

    chart: {
      type: 'pie',
      height: 300,
      width: 430,
    },

    labels: ['Chemistry', 'Biology', 'Physics', 'Commerce', 'Computer Science'],

    colors: ['#1574f2', '#10B981', '#15c9f2', '#F59E0B', '#f214af'],

    legend: {
      position: 'bottom',
    },

    dataLabels: {
      enabled: true,
    },

    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  public IssuedBooksLineChartOptions: IssuedBooksLineChartOptions = {
    series: [
      {
        name: 'Books Issued',
        data: [],
      },
    ],

    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    stroke: {
      curve: 'smooth',
      width: 4,
    },

    markers: {
      size: 5,
    },

    dataLabels: {
      enabled: false,
    },

    grid: {
      borderColor: '#f1f1f1',
    },

    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },

    title: {
      text: 'Monthly Issued Books',
      align: 'left',
    },
  };

  public libraryActivityChart: IssueReturnDueBarChartOptions = {
    series: [
      {
        name: 'Issued',
        data: [42, 50, 61, 58, 72, 81],
      },
      {
        name: 'Returned',
        data: [38, 46, 54, 52, 67, 74],
      },
      {
        name: 'Overdue',
        data: [4, 5, 7, 6, 5, 7],
      },
    ],

    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },

    legend: {
      position: 'top',
    },

    title: {
      text: 'Issued vs Returned vs Overdue',
      align: 'left',
    },

    colors: [
      '#6366F1', // Issued
      '#22C55E', // Returned
      '#EF4444', // Overdue
    ],
  };

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin([
      this.reportService.getUserDistribution(),
      this.reportService.getBookDistribution(),
      this.reportService.getSummary(),
      this.reportService.getMonthlyIssuedBooks(),
      this.reportService.getIssuedReturnedOverdueBooks(),
    ]).subscribe(
      ([
        allUsers,
        allBooks,
        summary,
        monthlyIssuedBooks,
        monthlyActivity,
      ]: any) => {
        //Set the value for users chart
        this.userChartOptions.labels.forEach((label) => {
          const count =
            allUsers.find(
              (role: any) => role.role.toLowerCase() == label.toLowerCase(),
            )?.count || 0;
          this.userChartOptions.series.push(count);
        });

        //Set the value for books chart
        this.BooksDonutChartOptions.labels.forEach((label) => {
          const count =
            allBooks.find(
              (book: any) => book.subject.toLowerCase() == label.toLowerCase(),
            )?.count || 0;
          this.BooksDonutChartOptions.series.push(count);
        });

        //Set summary data
        this.summaryData = summary[0];

        //Set monthly issued books
        setTimeout(() => {
          this.IssuedBooksLineChartOptions.series = [
            {
              name: 'Books Issued',
              data: monthlyIssuedBooks.map((item: any) => item.totalIssued),
            },
          ];

          this.IssuedBooksLineChartOptions.xaxis = {
            categories: monthlyIssuedBooks.map((item: any) => item.month),
          };
        }, 1000);

        //Set monthly activity (Issued, Returned, Overdue)
        this.libraryActivityChart.series = [
          {
            name: 'Issued',
            data: monthlyActivity.map((x: any) => x.issued),
          },
          {
            name: 'Returned',
            data: monthlyActivity.map((x: any) => x.returned),
          },
          {
            name: 'Overdue',
            data: monthlyActivity.map((x: any) => x.overdue),
          },
        ];

        this.libraryActivityChart.xaxis = {
          categories: monthlyActivity.map((x: any) => x.month),
        };

        this.isLoading = false;
      },
    );
  }
}
