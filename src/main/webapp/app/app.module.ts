import './vendor.ts';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';
import { NgJhipsterModule } from 'ng-jhipster';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { TrebolSharedModule } from 'app/shared';
import { TrebolCoreModule } from 'app/core';
import { TrebolAppRoutingModule } from './app-routing.module';
import { TrebolHomeModule } from './home/home.module';
import { TrebolAccountModule } from './account/account.module';
import { TrebolEntityModule } from './entities/entity.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from 'angularfire2/storage';

import * as moment from 'moment';

// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent, NavbarComponent, FooterComponent, PageRibbonComponent, ErrorComponent } from './layouts';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './layouts/breadcrumbs/breadcrumbs.component';

import { CONFIG_FIREBASE } from './app.constants';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './account/register';
import { PasswordStrengthBarComponent, PasswordComponent } from './account';
import { PasswordResetInitComponent } from 'app/account/password-reset/init/password-reset-init.component';
import { PasswordResetFinishComponent } from 'app/account/password-reset/finish/password-reset-finish.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
    imports: [
        BrowserModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        NgJhipsterModule.forRoot({
            alertAsToast: false,
            alertTimeout: 5000
        }),
        TrebolSharedModule.forRoot(),
        TrebolCoreModule,
        TrebolHomeModule,
        TrebolAccountModule,
        TrebolEntityModule,
        TrebolAppRoutingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(CONFIG_FIREBASE),
        AngularFireStorageModule, // imports firebase/storage only needed for storage features,
        AngularFirestoreModule
    ],

    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        LandingComponent,
        RegisterComponent,
        PasswordComponent,
        PasswordStrengthBarComponent,
        PasswordResetInitComponent,
        PasswordResetFinishComponent,
        LoadingComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true
        },
        AngularFirestoreModule
    ],
    bootstrap: [JhiMainComponent]
})
export class TrebolAppModule {
    constructor(private dpConfig: NgbDatepickerConfig) {
        this.dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    }
}
