import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-inner-html-renderer',
  templateUrl: './inner-html-renderer.component.html',
  styleUrls: ['./inner-html-renderer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InnerHtmlRendererComponent implements OnInit {

  @Input() htmlToRender: any;

  constructor() { }

  ngOnInit(): void {
  }

}
