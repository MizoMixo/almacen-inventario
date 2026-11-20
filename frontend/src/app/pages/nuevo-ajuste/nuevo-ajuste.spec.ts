import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoAjuste } from './nuevo-ajuste';

describe('NuevoAjuste', () => {
  let component: NuevoAjuste;
  let fixture: ComponentFixture<NuevoAjuste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoAjuste],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoAjuste);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
