import { Component, Input, OnInit } from '@angular/core';
import { Answer } from '../../models/etestermodel';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {


  @Input() answer?: Answer;
  @Input() questionanswerindex: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onIndexClicked(event: any): void {
//    console.log(`Index button clicked: ${event.target.innerHTML}`);
  }

}
