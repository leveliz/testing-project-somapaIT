import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators, } from '@angular/forms';

// interface ของข้อมูล
export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  score: number;
}

// ข้อมูลตัวอย่าง สำหรับแสดงในตารางเริ่มต้น
const ELEMENT_DATA: Person[] = [
  { id: 1, firstName: 'Wilbur', lastName: 'Rogers', gender: 'M', score: 80 },
  { id: 2, firstName: 'Lorenzo', lastName: 'Underwood', gender: 'M', score: 40.5 },
  { id: 3, firstName: 'Pearl', lastName: 'Johnson', gender: 'F', score: 60.45 },
  { id: 4, firstName: 'Russell', lastName: 'Patrick', gender: 'M', score: 70.5 },
  { id: 5, firstName: 'Nicolas', lastName: 'Watts', gender: 'M', score: 34.25 },
  { id: 6, firstName: 'Anny', lastName: 'Bates', gender: 'F', score: 74.5 }
];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project-test';

  // สร้างตัวแปรสำหรับเช็คว่ากำลังอยู่ในโหมดแก้ไขหรือไม่
  isEditing = false;
  editingId: number | null = null;

  // สร้างฟอร์มสำหรับรับข้อมูล
  form = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    gender: new FormControl('', Validators.required),
    score: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)])
  });

  // สร้างตัวแปรสำหรับเก็บข้อมูลตาราง
  displayedColumns: string[] = ['id', 'action', 'firstName', 'lastName', 'gender', 'score'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  // ฟังก์ชันสำหรับเพิ่มข้อมูลแถวใหม่และแก้ไขข้อมูลแถว
  onSubmit() {

    // เช็คว่าฟอร์มถูกต้องหรือไม่และแจ้งเตือนถ้าไม่ถูกต้อง
    if (!this.form.valid) {
      alert('Please fill out the form completely.');
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid) {

      // ถ้าอยู่ในโหมดแก้ไข ให้แก้ไขข้อมูลแถวที่เลือก
      if (this.isEditing && this.editingId !== null) {
        const index = this.dataSource.data.findIndex(item => item.id === this.editingId);
        if (index !== -1) {
          this.dataSource.data[index] = {
            id: this.editingId,
            firstName: this.form.value.firstName || '',
            lastName: this.form.value.lastName || '',
            gender: this.form.value.gender || '',
            score: Number(this.form.value.score)
          };
        }

        // รีเฟรชแหล่งข้อมูลเมื่อแก้ไขข้อมูลแถวเสร็จ
        this.isEditing = false;
        this.editingId = null;

        // ถ้าไม่อยู่ในโหมดแก้ไข ให้เพิ่มข้อมูลแถวใหม่
      } else {
        const maxId = this.dataSource.data.reduce((acc, cur) => Math.max(acc, cur.id), 0);
        const newPerson: Person = {
          id: maxId + 1,
          firstName: this.form.value.firstName || '',
          lastName: this.form.value.lastName || '',
          gender: this.form.value.gender || '',
          score: Number(this.form.value.score)
        };
        this.dataSource.data.push(newPerson);
      }

      this.dataSource._updateChangeSubscription(); // รีเฟรชแหล่งข้อมูล
      this.form.reset(); // รีเฟรชฟอร์ม
    }
  }

  // ฟังก์ชันสำหรับดึงข้อมูลแถวที่เลือกมาแก้ไขในฟอร์ม
  edit(row: Person) {
    this.isEditing = true;
    this.editingId = row.id;
    this.form.setValue({
      firstName: row.firstName,
      lastName: row.lastName,
      gender: row.gender,
      score: row.score.toString()
    });
  }

  // ฟังก์ชันสำหรับยกเลิกการแก้ไขหรือเพิ่มข้อมูลใหม่และรีเฟรชฟอร์ม
  cancel() {
    this.form.reset();
    this.isEditing = false;
    this.editingId = null;
  }

  // ฟังก์ชันสำหรับแปลงค่าเพศจากตัวย่อเป็นชื่อเต็ม
  getFullGenderName(gender: string): string {
    switch (gender) {
      case 'M': return 'Male';
      case 'F': return 'Female';
      case 'U': return 'Unkown';
      default: return '-';
    }
  }

}
