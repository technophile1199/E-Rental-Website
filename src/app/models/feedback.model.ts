export class Feedback {
  
    constructor(
      public name: string = '',
      public date: string = new Date().toISOString().split('T')[0],
      public Email: string = '',
      public Comments: string = ''
    ) {}
  }