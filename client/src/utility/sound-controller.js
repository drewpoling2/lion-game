import { Howl, Howler } from 'howler';
export const soundController = {
  die: new Howl({
    src: ['sounds/die.wav'],
    volume: 0.075,
  }),
  jump: new Howl({
    src: ['sounds/jump.wav'],
    volume: 0.075,
  }),
};
