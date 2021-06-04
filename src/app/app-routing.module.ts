import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { CargoListComponent } from "./cargo/cargo-list/cargo-list.component";
import { CargoCreateComponent } from "./cargo/cargo-create/cargo-create.component";
import { CargoListFirmComponent } from "./cargo/cargo-list-firm/cargo-list-firm.component"
import { StartPageComponent } from "./pages/start-page/start-page.component";
import { SignUpsListComponent } from "./signups/signups-list/signups-list.component";
import { ConfirmEmailSentComponent } from "./pages/confirm-email-sent/confirm-email-sent.component";
import { AdminUsersListComponent } from "./admin/users/user-list/users-list.component";
import { AdminDashboardComponent } from "./admin/dashboard/dashboard.component";
import { ShowMyProfileComponent } from "./profiles/show-my-profile/show-my-profile.component";
import { ShowProfileComponent } from "./profiles/show-profile/show-profile.component";
import { ProfileCreateComponent } from "./profiles/profile-create/profile-create.component";
import { TransportCreateComponent } from "./transport/transport-create/transport-create.component";
import { AdminGuard } from "./auth/admin.guard";
import { EmailGuard } from "./auth/email.guard";
import { ProfileGuard } from "./profiles/profile.guard";
import { Profile2Guard } from "./profiles/profile-2.guard";
import { SendCodeComponent } from "./pages/verify-phone/send-code/send-code.component";
import { VerifyPhoneComponent } from "./pages/verify-phone/verify/verify.component";
import { TransportListComponent } from "./transport/cargo-list/transport-list.component";
import { InviteComponent } from "./pages/invite/invite.component";
import { CMRCreateComponent } from "./cargo/cmr/cmr-create/cmr-create.component";
import { ShowCMRComponent } from "./cargo/cmr/show-cmr/show-cmr.component";
import { SendPasswordCodeComponent } from "./pages/forgot-password/send-code/send-code.component";
import { ChangePasswordComponent } from "./pages/forgot-password/change-password/change-password.component";
import { MyCargoListComponent } from "./cargo/my-cargo-list/my-cargo-list.component";
import { AboutComponent } from "./pages/about/about.component";
import { HowItWorksComponent } from "./pages/howitworks/howitworks.component";
import { ServicesComponent } from "./pages/services/services.component";
import { CareerComponent } from "./pages/career/career.component";
import { ImpressumComponent } from "./pages/impressum/impressum.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { CoverCreateComponent } from "./profiles/cover-create/cover-create.component";
import { PhotoCreateComponent } from "./profiles/photo-create/photo-create.component";

const routes: Routes = [
  /*App*/
  { path: "", component: StartPageComponent },
  { path: "listCargos", component: CargoListComponent },
  { path: "listTransports", component: TransportListComponent },
  { path: "createCargo", component: CargoCreateComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "editCargo/:cargoId", component: CargoCreateComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "firmSignUps", component: CargoListFirmComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "mySignUps", component: SignUpsListComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "showMyProfile", component: ShowMyProfileComponent, canActivate: [AuthGuard, EmailGuard, Profile2Guard] },
  { path: "showProfile", component: ShowProfileComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "createProfile", component: ProfileCreateComponent, canActivate: [AuthGuard, EmailGuard, ProfileGuard] },
  { path: "createTransport", component: TransportCreateComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  { path: "confirmEmailSent", component: ConfirmEmailSentComponent },
  { path: "sendCode", component: SendCodeComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "verifyPhone", component: VerifyPhoneComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "invite", component: InviteComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "createCMR", component: CMRCreateComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "showCMR", component: ShowCMRComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "forgotPassword", component: SendPasswordCodeComponent },
  { path: "changeForgottenPassword", component: ChangePasswordComponent },
  { path: "myCargoList", component: MyCargoListComponent, canActivate: [AuthGuard, EmailGuard] },
  { path: "about", component: AboutComponent },
  { path: "howItWorks", component: HowItWorksComponent },
  { path: "services", component: ServicesComponent },
  { path: "career", component: CareerComponent },
  { path: "impressum", component: ImpressumComponent },
  { path: "contact", component: ContactComponent },
  { path: "createCover", component: CoverCreateComponent },
  { path: "createPhoto", component: PhotoCreateComponent },



  /*Admin*/
  { path: "admin/users", component: AdminUsersListComponent, canActivate: [AuthGuard, AdminGuard, EmailGuard] },
  { path: "admin/dashboard", component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard, EmailGuard] }

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard, EmailGuard, ProfileGuard, Profile2Guard]
})
export class AppRoutingModule {}
