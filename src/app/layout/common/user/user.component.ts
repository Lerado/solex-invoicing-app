import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, input, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'sia-user',
    templateUrl: './user.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
    imports: [MatButtonModule, MatMenuModule, MatIconModule, NgClass, MatDividerModule]
})
export class UserComponent {

    private readonly _userService = inject(UserService);

    showAvatar = input(true, { transform: booleanAttribute });

    user = toSignal(this._userService.user$, { requireSync: true });
    displayedReference = computed(() => `${this.user().cityCode}${this.user().cashierReference} - ${this.user().cashierName}`);
}
