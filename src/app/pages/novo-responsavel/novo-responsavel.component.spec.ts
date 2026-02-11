import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoResponsavelComponent } from './novo-responsavel.component';

describe('NovoResponsavelComponent', () => {
  let component: NovoResponsavelComponent;
  let fixture: ComponentFixture<NovoResponsavelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoResponsavelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoResponsavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
