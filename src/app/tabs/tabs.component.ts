import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
    standalone: false
})
export class TabsComponent {

  shouldDisplayTabs = true;

  constructor(private router: Router) { }



}
