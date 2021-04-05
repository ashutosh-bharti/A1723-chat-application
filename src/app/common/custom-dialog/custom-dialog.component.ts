import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  description: string;
  data: any;
}

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css']
})
export class CustomDialogComponent implements OnInit {

  title: string;
  description: string;
  value: any;

  constructor(private dialogRef: MatDialogRef<CustomDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: DialogData) {

    this.title = data.title;
    this.description = data.description;
    this.value = data.data;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.value = this.value.trim();
    if (this.value) {
      this.dialogRef.close(this.value);
    }
    else {
      this.dialogRef.close();
    }
  }

}
