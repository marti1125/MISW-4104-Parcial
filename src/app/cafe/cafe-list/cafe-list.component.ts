import { Component, OnInit } from '@angular/core';
import { Cafe } from '../cafe';
import { CafeService } from '../cafe.service';

@Component({
  selector: 'app-cafe-list',
  templateUrl: './cafe-list.component.html',
  styleUrls: ['./cafe-list.component.css']
})
export class CafeListComponent implements OnInit {

  cafes: Array<Cafe> = [];

  totalPorTipo: { [tipo: string]: number } = {};

  constructor(private cafeService: CafeService) { }

  getCafes() {
    this.cafeService.getCafes().subscribe((data: Cafe[]) => {
      this.cafes = data;
      this.totalPorTipo = this.cafes.reduce((acc, cafe) => {
        acc[cafe.tipo] = (acc[cafe.tipo] || 0) + 1;
        return acc;
      }, {} as { [tipo: string]: number });
    });
  }

  ngOnInit() {
    this.getCafes();
  }

  nombreCafe(tipo: string): string {
    return (tipo === 'Blend' ? 'café ' + tipo : tipo).toLowerCase();
  }

}
