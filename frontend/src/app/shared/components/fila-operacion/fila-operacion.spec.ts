import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilaOperacion } from './fila-operacion';

describe('FilaOperacion', () => {
  let component: FilaOperacion;
  let fixture: ComponentFixture<FilaOperacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilaOperacion],
    }).compileComponents();

    fixture = TestBed.createComponent(FilaOperacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
