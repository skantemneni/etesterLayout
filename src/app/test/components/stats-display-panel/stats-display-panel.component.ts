import { Component, Input, OnInit } from '@angular/core';
import { ResponseDetails } from '@app/models/etestermodel';

@Component({
  selector: 'app-stats-display-panel',
  templateUrl: './stats-display-panel.component.html',
  styleUrls: ['./stats-display-panel.component.scss']
})
export class StatsDisplayPanelComponent implements OnInit {

  /**
   * Input Variables
   */
  @Input() displayableHeading: string = "Stats";
  @Input() totalQuestionCount = 0;
  @Input() totalPointCount = 0;
  private _responseDetails?: ResponseDetails | undefined = undefined;
  @Input()
  public get responseDetails(): ResponseDetails | undefined {
    return this._responseDetails;
  }
  public set responseDetails(responseDetails: ResponseDetails | undefined) {
    this._responseDetails = responseDetails;
    this.answeredCount = this._responseDetails?.answeredCount || 0;
    this.answeredPoints = this._responseDetails?.answeredPoints || 0;
    this.correctCount = this._responseDetails?.correctCount || 0;
    this.correctPoints = this._responseDetails?.correctPoints || 0;
  }
  @Input() idTest?: string;
  @Input() idTestsegment?: string;
  @Input() idTestsection?: string;

  /**
   * Local Variables
   */

  answeredCount = 0;
  answeredPoints = 0;
  correctCount = 0;
  correctPoints = 0;

  constructor() { }

  ngOnInit(): void {
  }


}
