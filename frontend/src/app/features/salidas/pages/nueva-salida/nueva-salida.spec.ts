import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevaSalida } from './nueva-salida';

describe('NuevaSalida', () => {
  let component: NuevaSalida;
  let fixture: ComponentFixture<NuevaSalida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaSalida],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaSalida);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
