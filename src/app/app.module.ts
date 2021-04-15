import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ChatOperationService } from './services/chat-operation.service';
import { AuthenticService } from './services/authentic.service';
import { ChatService } from './services/chat.service';
import { GroupService } from './services/group.service';

import { NotFoundComponent } from './common/not-found/not-found.component';
import { HeaderComponent } from './common/header/header.component';
import { AboutUsComponent } from './common/about-us/about-us.component';
import { UserProfileComponent } from './common/user-profile/user-profile.component';
import { CustomDialogComponent } from './common/custom-dialog/custom-dialog.component';
import { ChatNavComponent } from './common/chat-nav/chat-nav.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ChatlistComponent } from './components/chatlist/chatlist.component';
import { ChatInfoComponent } from './components/chat-info/chat-info.component';
import { MessageInfoComponent } from './components/message-info/message-info.component';

const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    ChatNavComponent,
    HeaderComponent,
    ChatlistComponent,
    ChatInfoComponent,
    MessageInfoComponent,
    CustomDialogComponent,
    AboutUsComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    LayoutModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatRippleModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,

    SocketIoModule.forRoot(config)
  ],
  providers: [
    ChatOperationService,
    AuthenticService,
    ChatService,
    GroupService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
