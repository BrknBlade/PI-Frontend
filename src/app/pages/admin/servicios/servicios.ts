import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CutData } from '../../../services/cutData/cut-data';
@Component({
  selector: 'app-servicios',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios implements OnInit {
  panelOpen = false;
  isEdition = false;
  formService: FormGroup;
  selectedCutId: any = null;

  private cutService = inject(CutData);
  cuts = this.cutService.cutsData;

  constructor(private fb: FormBuilder) {
    this.formService = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: [null, Validators.required],
      price: [null, Validators.required],
      // category: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.table(this.cutService.getCuts().subscribe());
  }

  openPanel(cut?: any) {
    this.isEdition = !!cut;
    this.panelOpen = true;

    if (cut) {
      this.selectedCutId = cut.id;
      this.formService.patchValue(cut);
    } else {
      this.selectedCutId = null;
      this.formService.reset();
    }
  }

  closePanel() {
    this.panelOpen = false;
    this.selectedCutId = null;
    this.formService.reset();
  }

  save() {
    if (this.formService.invalid) {
      return;
    }

    if (this.isEdition) {
      this.cutService.updateCut(this.selectedCutId, this.formService.value).subscribe(() => {
        this.closePanel();
      });
    } else {
      this.cutService.createCut(this.formService.value).subscribe(() => {
        this.closePanel();
      });
    }
  }

  deleteCut(cutId: any) {
    this.cutService.deleteCut(cutId).subscribe();
  }
}
