import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscadorMateriales } from './buscador-materiales';

describe('BuscadorMateriales', () => {
  let component: BuscadorMateriales;
  let fixture: ComponentFixture<BuscadorMateriales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorMateriales],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorMateriales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
