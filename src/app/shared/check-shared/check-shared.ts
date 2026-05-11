import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-check-shared',
  imports: [CommonModule],
  templateUrl: './check-shared.html',
  styleUrl: './check-shared.css',
})
export class CheckShared {
  @Input() currentPage: number = 1;

  totalPages = [1, 2, 3, 4];

  getPage(page: number): 'done' | 'active' | 'pending' {
    if (page < this.currentPage) {
      return 'done';
    }
    if (page === this.currentPage) {
      return 'active';
    }

    return 'pending';
  }
}
