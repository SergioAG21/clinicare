import { Component, inject } from '@angular/core';
import { SideMenuItem } from '@shared/components/side-menu-item/side-menu-item';
import { ContactService } from '@shared/services/contact.service';
import { MenuIcon } from '@shared/icons/home/menu-icon/menu-icon';
import { AboutIcon } from '@shared/icons/home/navigation/about-icon/about-icon';
import { PendingIcon } from '@shared/icons/pending-icon/pending-icon';
import { MessageIcon } from '@shared/icons/message-icon/message-icon';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'admin-side-menu-items',
  imports: [SideMenuItem, MenuIcon, AboutIcon, PendingIcon, MessageIcon],
  templateUrl: './admin-side-menu-items.html',
})
export class AdminSideMenuItems {
  private contactService = inject(ContactService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.contactService.getAllMessages().subscribe();
    this.userService.getAllUsers().subscribe();
  }

  public messagesCount = this.contactService.messagesCount;

  public userPendingCount = this.userService.userPendingCount;
}
