import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopMatchComponent } from './stop-match.component';

describe('StopMatchComponent', () => {
  let component: StopMatchComponent;
  let fixture: ComponentFixture<StopMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StopMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
