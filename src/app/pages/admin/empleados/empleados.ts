import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee/employees';

@Component({
  selector: 'app-empleados',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css',
})
export class Empleados implements OnInit {
  panelOpen = false;
  isEdition = false;
  formService: FormGroup;
  selectedEmployeeId: any = null;

  private employeeService = inject(EmployeeService);
  employeesData = this.employeeService.employeesData;

  constructor(private fb: FormBuilder) {
    this.formService = this.fb.group({
      name:      ['', Validators.required],
      role:      ['', Validators.required],
      specialty: ['', Validators.required],
      image_url: [''],
    });
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe();
  }

  openPanel(employee?: any): void {
    this.isEdition = !!employee;
    this.panelOpen = true;

    if (employee) {
      this.selectedEmployeeId = employee.id;
      this.formService.patchValue(employee);
    } else {
      this.selectedEmployeeId = null;
      this.formService.reset();
    }
  }

  closePanel(): void {
    this.panelOpen = false;
    this.selectedEmployeeId = null;
    this.formService.reset();
  }

  save(): void {
    if (this.formService.invalid) return;

    if (this.isEdition) {
      this.employeeService.updateEmployee(this.selectedEmployeeId, this.formService.value).subscribe(() => {
        this.closePanel();
      });
    } else {
      this.employeeService.createEmployee(this.formService.value).subscribe(() => {
        this.closePanel();
      });
    }
  }

  delete(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe();
  }
}