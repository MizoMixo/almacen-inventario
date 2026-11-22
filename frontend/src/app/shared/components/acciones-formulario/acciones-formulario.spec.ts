import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccionesFormulario } from './acciones-formulario';

describe('AccionesFormulario', () => {
  let component: AccionesFormulario;
  let fixture: ComponentFixture<AccionesFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccionesFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(AccionesFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
