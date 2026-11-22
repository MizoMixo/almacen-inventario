import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncabezadoFormulario } from './encabezado-formulario';

describe('EncabezadoFormulario', () => {
  let component: EncabezadoFormulario;
  let fixture: ComponentFixture<EncabezadoFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncabezadoFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(EncabezadoFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
