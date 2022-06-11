import { Fluid } from './fluid';

export class PipeSegment {
  capacity: number;
  color: string;
  contents: Fluid;

  constructor(capacity: number, color: string, contents: Fluid) {
    this.capacity = capacity;
    this.color = color;
    this.contents = contents;
  }
}
