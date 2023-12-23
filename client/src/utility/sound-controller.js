import { Howl, Howler } from 'howler';
export const soundController = {
  die: new Howl({
    src: ['sounds/die.wav'],
    volume: 0,
  }),
  jump: new Howl({
    src: ['sounds/jump.wav'],
    volume: 0,
  }),
  beatScore: new Howl({
    src: ['sounds/beatScore.wav'],
    volume: 0,
  }),
  pickupCoin: new Howl({
    src: ['sounds/pickupCoin.wav'],
    volume: 0,
  }),
  takeDamage: new Howl({
    src: ['sounds/takeDamage.wav'],
    volume: 0,
  }),
};
