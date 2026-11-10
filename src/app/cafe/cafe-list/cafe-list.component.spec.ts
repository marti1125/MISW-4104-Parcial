/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { faker } from '@faker-js/faker';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CafeListComponent } from './cafe-list.component';
import { CafeService } from '../cafe.service';
import { Cafe } from '../cafe';

describe('CafeListComponent', () => {
  let component: CafeListComponent;
  let fixture: ComponentFixture<CafeListComponent>;
  let debug: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafeListComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [CafeService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafeListComponent);
    component = fixture.componentInstance;

    for (let i = 0; i < 5; i++) {
      const cafe = new Cafe(
        i,
        faker.company.name(),
        faker.helpers.arrayElement(['Café de Origen', 'Blend']),
        faker.location.state(),
        faker.food.adjective(),
        faker.number.int({ min: 800, max: 2000 }),
        faker.image.url()
      );
      component.cafes.push(cafe);
    }

    debug = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe crear la tabla con seis filas más el encabezado', () => {
    const theadRows = debug.queryAll(By.css('thead tr'));
    expect(theadRows.length).toBe(1);

    const tbodyRows = debug.queryAll(By.css('tbody tr'));
    expect(tbodyRows.length).toBe(5);

    const allRows = debug.queryAll(By.css('table tr'));
    expect(allRows.length).toBe(6);

    tbodyRows.forEach((row, index) => {
      expect(row.nativeElement.textContent).toContain(component.cafes[index].nombre);
    });
  });

  it('debe mostrar los totales por tipo de cafe', () => {
    component.totalPorTipo = component.cafes.reduce((acc, cafe) => {
      acc[cafe.tipo] = (acc[cafe.tipo] || 0) + 1;
      return acc;
    }, {} as { [tipo: string]: number });

    fixture.detectChanges();

    const totalElements = debug.queryAll(By.css('ul.list-unstyled li'));
    expect(totalElements.length).toBe(Object.keys(component.totalPorTipo).length);

    const contenidoTexto = fixture.nativeElement.textContent;
    Object.entries(component.totalPorTipo).forEach(([tipo, total]) => {
      const textoEsperado = `Total ${component.nombreCafe(tipo)}: ${total}`;
      expect(contenidoTexto).toContain(textoEsperado);
    });
  });

});
