import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMatchComponent } from './schedule-match.component';

describe('ScheduleMatchComponent', () => {
  let component: ScheduleMatchComponent;
  let fixture: ComponentFixture<ScheduleMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
