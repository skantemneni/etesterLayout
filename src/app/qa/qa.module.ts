import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from './components/question/question.component';
import { AnswerComponent } from './components/answer/answer.component';
/*Import*/
import { MathjaxModule } from "mathjax-angular";



@NgModule({
  declarations: [
    QuestionComponent,
    AnswerComponent,
  ],
  imports: [
    CommonModule,
    MathjaxModule.forRoot(/*Optional Config*/
      {
        "config": {
          "loader": {
            "load": ["output/svg", "[tex]/require", "[tex]/ams"]
          },
          "tex": {
            "inlineMath": [["$", "$"]],
            "packages": ["base", "require", "ams"]
          },
          "svg": { "fontCache": "global" }
        },
        "src": "https://cdn.jsdelivr.net/npm/mathjax@3.0.0/es5/startup.js"
      }
    ),
  ],
  exports: [
    QuestionComponent,
    AnswerComponent,
  ]
})
export class QAModule { }
