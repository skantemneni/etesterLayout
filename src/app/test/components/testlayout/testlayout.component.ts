import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TestContainerComponent } from '../test-container/test-container.component';
import * as TestConstants from '@app/models/TestConstants';

@Component({
  selector: 'app-testlayout',
  templateUrl: './testlayout.component.html',
  styleUrls: ['./testlayout.component.scss']
})
export class TestlayoutComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      console.log(`TestlayoutComponent.ngOnInit.routeParams: ${JSON.stringify(params)}`);
      this.usertestId = params['usertestId'];
      console.log(`TestlayoutComponent.ngOnInit.this.usertestId: ${this.usertestId}`);
    });
  }

  /**
   * This is a router parameter that tells us what userTest to render
   */
  usertestId: string | undefined = undefined;

}
