import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    addDays,
    addHours,
    addMonths,
    addWeeks,
    endOfDay,
    endOfMonth,
    isSameDay,
    isSameMonth,
    setHours,
    setMinutes,
    startOfDay,
    subDays,
    subMonths,
    subWeeks
} from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IUser, UserService } from 'app/core';
import { IListPurchase } from 'app/shared/model/list-purchase.model';
import { IListSchedule } from 'app/shared/model/list-schedule.model';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ListScheduleService } from 'app/entities/list-schedule';
import { ListPurchaseService } from 'app/entities/list-purchase';
import { JhiAlertService } from 'ng-jhipster';
import { Router } from '@angular/router';
const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};

@Component({
    selector: 'jhi-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './calendar.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../../../../../../node_modules/angular-calendar/scss/angular-calendar.scss']
})
export class CalendarComponent implements OnInit {
    listSchedules: IListSchedule[];
    listPurchase: IListPurchase[];
    purchaseEvent: IListPurchase;
    locale = 'es';
    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    CalendarView = CalendarView;

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    view = 'month';

    viewDate: Date = new Date();

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                console.log('event');
                for (const purchase of this.listPurchase) {
                    if (event.title === purchase.name) {
                        this.router.navigate(['/product-list/' + purchase.id + '/edit']);
                    }
                }
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                for (const purchase of this.listPurchase) {
                    if (event.title === purchase.name) {
                        this.purchaseEvent = purchase;
                    }
                }
                if (this.purchaseEvent !== undefined) {
                    for (const schedule of this.listSchedules) {
                        if (schedule.purchaseid === this.purchaseEvent.id) {
                            this.listScheduleService.delete(schedule.id).subscribe(response => {});
                        }
                    }
                }
                this.events = this.events.filter(iEvent => iEvent !== event);
            }
        }
    ];
    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];

    activeDayIsOpen = true;
    constructor(
        private modal: NgbModal,
        protected listScheduleService: ListScheduleService,
        protected listPurchaseService: ListPurchaseService,
        protected userService: UserService,
        protected jhiAlertService: JhiAlertService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadAll();
        this.listPurchaseService
            .query()
            .pipe(
                filter((res: HttpResponse<IListPurchase[]>) => res.ok),
                map((res: HttpResponse<IListPurchase[]>) => res.body)
            )
            .subscribe((res: IListPurchase[]) => {
                this.listPurchase = res;
            });
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        this.modal.open(this.modalContent, { size: 'lg' });
    }

    deleteEvent(eventToDelete: CalendarEvent) {
        this.events = this.events.filter(event => event !== eventToDelete);
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

    increment(): void {
        const addFn: any = {
            day: addDays,
            week: addWeeks,
            month: addMonths
        }[this.view];

        this.viewDate = addFn(this.viewDate, 1);
    }

    decrement(): void {
        const subFn: any = {
            day: subDays,
            week: subWeeks,
            month: subMonths
        }[this.view];

        this.viewDate = subFn(this.viewDate, 1);
    }

    today(): void {
        this.viewDate = new Date();
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            this.viewDate = date;
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
        }
    }

    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.refresh.next();
    }

    addEvent(title1, date): void {
        this.events.push({
            title: title1,
            start: startOfDay(date),
            color: colors.red,
            actions: this.actions
        });
        this.refresh.next();
    }

    loadAll() {
        this.listScheduleService
            .query()
            .pipe(
                filter((res: HttpResponse<IListSchedule[]>) => res.ok),
                map((res: HttpResponse<IListSchedule[]>) => res.body)
            )
            .subscribe(
                (res: IListSchedule[]) => {
                    this.listSchedules = res;
                    for (const schedule of this.listSchedules) {
                        this.listPurchaseService
                            .find(schedule.purchaseid)
                            .pipe(
                                filter((res1: HttpResponse<IListPurchase>) => res1.ok),
                                map((res1: HttpResponse<IListPurchase>) => res1.body)
                            )
                            .subscribe((res1: IListPurchase) => {
                                const purchase = res1;
                                const userExtra = purchase.seller;

                                this.userService
                                    .query()
                                    .pipe(
                                        filter((res2: HttpResponse<IUser[]>) => res2.ok),
                                        map((res2: HttpResponse<IUser[]>) => res2.body)
                                    )
                                    .subscribe((res2: IUser[]) => {
                                        const users = res2;
                                        for (const user of users) {
                                            if (purchase.state && user.id === userExtra.userId) {
                                                this.addEvent(purchase.name, schedule.time.toDate());
                                            }
                                        }
                                    });
                            });
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
