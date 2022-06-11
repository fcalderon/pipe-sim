export abstract class Fluid {
  volume: number;
  weight: number;
  color: string;

  constructor(volume: number, weight: number, color: string) {
    this.volume = volume;
    this.weight = weight;
    this.color = color;
  }

  abstract getShape(): any;
}
