import { Howl, Howler } from 'howler';
export const soundController = {
  die: new Howl({
    src: ['sounds/die.wav'],
  }),
  jump: new Howl({
    src: ['sounds/jump.wav'],
  }),
};
