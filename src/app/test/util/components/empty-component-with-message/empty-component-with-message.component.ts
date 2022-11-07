import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-component-with-message',
  templateUrl: './empty-component-with-message.component.html',
  styleUrls: ['./empty-component-with-message.component.scss']
})
export class EmptyComponentWithMessageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() heading: string = "Empty Heading";
  @Input() message: string = "Empty Message";

}
