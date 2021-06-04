import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { AngularMaterialModule } from "./angular-material.module";
import { PostsModule } from "./posts/posts.module";
import { CargosModule } from "./cargo/cargo.module";
import { ProfileModule } from "./profiles/profile.module";
import { TransportModule } from "./transport/transport.module";
import { StartPageComponent } from "./pages/start-page/start-page.component";
import { ConfirmEmailSentComponent } from "./pages/confirm-email-sent/confirm-email-sent.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminModule } from "./admin/admin.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SendCodeComponent } from "./pages/verify-phone/send-code/send-code.component";
import { VerifyPhoneComponent } from "./pages/verify-phone/verify/verify.component";
import { InviteComponent } from "./pages/invite/invite.component";
import { SendPasswordCodeComponent } from "./pages/forgot-password/send-code/send-code.component";
import { ChangePasswordComponent } from "./pages/forgot-password/change-password/change-password.component";
import { FooterComponent } from "./footer/footer.component";
import { AboutComponent } from "./pages/about/about.component";
import { HowItWorksComponent } from "./pages/howitworks/howitworks.component";
import { ServicesComponent } from "./pages/services/services.component";
import { CareerComponent } from "./pages/career/career.component";
import { ImpressumComponent } from "./pages/impressum/impressum.component";
import { ContactComponent } from "./pages/contact/contact.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    StartPageComponent,
    ConfirmEmailSentComponent,
    SendCodeComponent,
    VerifyPhoneComponent,
    InviteComponent,
    SendPasswordCodeComponent,
    ChangePasswordComponent,
    FooterComponent,
    AboutComponent,
    HowItWorksComponent,
    ServicesComponent,
    CareerComponent,
    ImpressumComponent,
    ContactComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
    CargosModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    AdminModule,
    NgbModule,
    ProfileModule,
    TransportModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
