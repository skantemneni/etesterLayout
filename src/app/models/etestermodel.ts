export interface Usertestwithresponse {
  idTest: string;
  idUsertest: string;
  idUsertestresponse: string;
  testStatus: string;
  testResponse: string;
  dateSaved: string;
  completed: boolean;
}

export interface Testwithresponse {
  idTest: string;
  test: Test;
  testStatus: string;
  testResponse: string;
}

export interface Test {
  idTest: string;
  idProvider: number;
  idOrganization: number;
  idChannel: number;
  name: string;
  description: string;
  text: string;
  addlInfo: string;
  testLevel: number;
  timed: boolean;
  reportBySubject: boolean;
  timeToAnswer: number;
  published: boolean;
  accessLevel: number;
  testType: string;
  isPractice: boolean;
  autoGrade: boolean;
  autoPublishResults: boolean;
  isFree: boolean;
  dateFreeStart: string;
  dateFreeEnd: string;
  subscriptionDateFreeEnd: string;
  freeMessage: string;
  freeMessageMore: string;
  questionCount: number;
  pointCount: number;
  examtrack: string;
  combineSections: boolean;
  organizationName: string;
  providerName: string;
  channelName: string;
  examtrackDescription: string;
  testsegments: Testsegment[];
}

export interface Testsegment {
  idTestsegment: string;
  idTest: string;
  name: string;
  description: string;
  text: string;
  addlInfo: string;
  seq: number;
  timeToAnswer: number;
  published: boolean;
  sectionwrapper: boolean;
  questionCount: number;
  pointCount: number;
  testsections: Testsection[];
}

export interface Testsection {
  idTestsection: string;
  idTestsegment: string;
  idSectionRef: string;
  name: string;
  description: string;
  instructionsName: string;
  reportSubject: string;
  timeToAnswer: number;
  seq: number;
  questionCount: number;
  pointCount: number;
  pointsPerQuestion: number;
  negativePointsPerQuestion: number;
  unansweredPointsPerQuestion: number;
  questionStartIndex: number;
  distributedScoring: boolean;
  section: Section;
}

export interface Section {
  idSection: string;
  idProvider: number;
  idSkill: string;
  name: string;
  description: string;
  text: string;
  isLinktext: boolean;
  linktextAddress: boolean;
  addlInfo: string;
  timeToAnswer: null,
  pointsPerQuestion: number;
  negativePointsPerQuestion: number;
  unansweredPointsPerQuestion: number;
  questionStartIndex: number;
  distributedScoring: boolean;
  autoGenerated: boolean;
  generatorMetadata: string;
  questionBanner: string;
  questionHeading: string;
  questionInstructions: string;
  isExternal: boolean;
  sectionType: string;
  isPractice: boolean;
  questions: Question[];
}

export interface Question {
  idQuestion: string;
  idSection: string;
  name: string;
  description: string;
  banner: string;
  heading: string;
  instructions: string;
  questionType: string;
  text: string;
  addlInfo: string;
  textPrecontext: string;
  textPostcontext: string;
  multipleAnswers: boolean;
  allAnswers: boolean;
  points: number;
  idQuestionset: string;
  referenceSkills: string;
  idReferenceTopic: string;
  idReferenceLevel: string;
  questionsetText: string;
  questionOrder: number;
  answers: Answer[];
}

export interface Answer {
  idAnswer: string;
  idQuestion: string;
  seq: string;
  correct: boolean;
  text: string;
  addlInfo: string;
  answerCompareType: string;
  answerCompareAddlInfo: string;
  precisionDigits: number;
  caseSensitive: boolean;
  trimOuterSpaces: boolean;
  trimExtraInnerSpaces: boolean;
}


export interface ITestResponse {
  idTest: string;
  testsegmentResponses: ITestsegmentResponse[];
  testResponseDetails: IResponseDetails;
}
export class TestResponse implements ITestResponse {
  idTest: string;
  testsegmentResponses: ITestsegmentResponse[];
  testResponseDetails: IResponseDetails;
  constructor(idTest: string, testsegmentResponses: ITestsegmentResponse[], testResponseDetails: IResponseDetails) {
    this.idTest = idTest;
    this.testsegmentResponses = testsegmentResponses;
    this.testResponseDetails = testResponseDetails;
  }
}



export interface ITestsegmentResponse {
  idTestsegment: string;
  testsectionResponses: ITestsectionResponse[];
  testsegmentResponseDetails: IResponseDetails;
}
export class TestsegmentResponse implements ITestsegmentResponse {
  idTestsegment: string;
  testsectionResponses: ITestsectionResponse[];
  testsegmentResponseDetails: IResponseDetails;
  constructor(idTestsegment: string, testsectionResponses: ITestsectionResponse[], testsegmentResponseDetails: IResponseDetails) {
    this.idTestsegment = idTestsegment;
    this.testsectionResponses = testsectionResponses;
    this.testsegmentResponseDetails = testsegmentResponseDetails;
  }
}



export interface ITestsectionResponse {
  idTestsection: string;
  idSection:  string;
  questionResponses: IQuestionResponse[];
  testsectionResponseDetails: IResponseDetails;
}
export class TestsectionResponse implements ITestsectionResponse {
  idTestsection: string;
  idSection: string;
  questionResponses: IQuestionResponse[];
  testsectionResponseDetails: IResponseDetails;
  constructor(idTestsection: string, idSection: string, questionResponses: IQuestionResponse[], testsectionResponseDetails: IResponseDetails) {
    this.idTestsection = idTestsection;
    this.idSection = idSection;
    this.questionResponses = questionResponses;
    this.testsectionResponseDetails = testsectionResponseDetails;
  }
}



export interface IQuestionResponse {
  idQuestion: string;
  serializedAnswerResponses: string;
  questionStatus: string;
  timeInSeconds?: number;
  score?: number;
  questionResponseDetails?: IResponseDetails;
}
export class QuestionResponse implements IQuestionResponse {
  idQuestion: string;
  serializedAnswerResponses: string;
  questionStatus: string;
  timeInSeconds?: number;
  score?: number;
  questionResponseDetails?: IResponseDetails;
  constructor(idQuestion: string, serializedAnswerResponses: string, questionStatus: string, /* timeInSeconds: number, score: number, */ questionResponseDetails?: IResponseDetails) {
    this.idQuestion = idQuestion;
    this.serializedAnswerResponses = serializedAnswerResponses;
    this.questionStatus = questionStatus;
//    this.timeInSeconds = timeInSeconds;
//    this.score = score;
    this.questionResponseDetails = questionResponseDetails;
  }
}



export interface IResponseDetails {
  answeredCount: number;
  answeredPoints: number;
  correctCount: number;
  correctPoints: number;
}
export class ResponseDetails implements IResponseDetails {
  answeredCount: number;
  answeredPoints: number;
  correctCount: number;
  correctPoints: number;
  constructor(answeredCount: number, answeredPoints: number, correctCount: number, correctPoints: number) {
    this.answeredCount = answeredCount;
    this.answeredPoints = answeredPoints;
    this.correctCount = correctCount;
    this.correctPoints = correctPoints;
  }
}
