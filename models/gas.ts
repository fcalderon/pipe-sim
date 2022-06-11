import { Fluid } from 'models/fluid';

class Gas extends Fluid {
  constructor(volume: number, weight: number, color: string) {
    super(volume, weight, color);
  }

  // TODO
  getShape(): any {
  }
}
