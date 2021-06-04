import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { UsersService } from "../users.service";
import { User } from "../user.model";
import { PageEvent} from "@angular/material/paginator";
import { Subscription } from "rxjs";
import AWN from "awesome-notifications";

@Component({
  selector: "app-admin-users",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"]
})
export class AdminUsersListComponent {
  isLoading = false;
  users: User[] = [];
  approveForm = new FormGroup({});
  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [3, 20, 50, 100];
  private usersSub: Subscription;
  notifier = new AWN();

  constructor(private usersService: UsersService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUsers(this.usersPerPage, this.currentPage);
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((userData: { users: User[]; userCount: number }) => {
        this.isLoading = false;
        this.totalUsers = userData.userCount;
        this.users = userData.users;
        console.log(this.users);
      });
  }

  onApprove(userId: string) {
    let onOk = () => {
      this.isLoading = true;
      this.usersService.approve(userId).subscribe(()=> {
        this.isLoading = false;
        this.notifier.success('User approved');
        this.usersService.getUsers(this.usersPerPage, this.currentPage);
      });
    };
    let onCancel = () => {
      this.isLoading = false;
    };
    this.notifier.confirm(
      'Are you sure you want to approve user',
      onOk,
      onCancel,
      {
        labels: {
          confirm: 'Dangerous action'
        }
      }
    )
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.usersService.getUsers(this.usersPerPage, this.currentPage);
  }

  onDeleteTruck(truckId: string) {
    let onOk = () => {
      this.isLoading = true;
      this.usersService.deleteTruck(truckId).subscribe(() => {
        this.usersService.getUsers(this.usersPerPage, this.currentPage);
        this.notifier.success('Truck deleted');
        this.usersService.getUsers(this.usersPerPage, this.currentPage);
      });
      this.isLoading = false;
    };
    let onCancel = () => {
      this.isLoading = false;
    };
    this.notifier.confirm(
      'Are you sure you want to delete truck',
      onOk,
      onCancel,
      {
        labels: {
          confirm: 'Dangerous action'
        }
      }
    )
  }

  onApproveTruck(truckId: string) {
    let onOk = () => {
      this.isLoading = true;
      this.usersService.approveTruck(truckId).subscribe(() => {
        this.notifier.success('Truck approved');
        this.isLoading = false;
        this.usersService.getUsers(this.usersPerPage, this.currentPage);
      });
      this.isLoading = false;
    };
    let onCancel = () => {
      this.isLoading = false;
    };
    this.notifier.confirm(
      'Are you sure you want to approve truck',
      onOk,
      onCancel,
      {
        labels: {
          confirm: 'Dangerous action'
        }
      }
    )
  }
}
