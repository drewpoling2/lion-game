import StateSingleton from '../game-state';
import starImg from '../public/imgs/icons/Star.png';

const { getGrade } = StateSingleton;

export function generateDigitWithStars(digit) {
  const digits = [
    ` <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-between digit-container-top">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>`, // 0

    ` 
        <div class="flex-col items-center"><img class="digit-star" src="${starImg}"/>
    <br>
      <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    </div>`, // 1

    ` <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-end digit-container-top">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>`, // 2

    ` <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-end digit-container-top">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-end">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>`, // 3

    ` <div class="flex justify-between">
        <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    </div>
    <br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-end digit-container-top">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-end">
    <img class="digit-star" src="${starImg}"/>
    </div>`, // 4

    `<img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-start digit-container-top">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-end">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>`, // 5

    `<img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-start digit-container-top">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>`, // 6

    `<img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex-col items-end digit-container-top">
      <img class="digit-star" src="${starImg}"/>
    <br>
      <img class="digit-star" src="${starImg}"/>
      <br>
    <img class="digit-star" src="${starImg}"/>
    <br>
      <img class="digit-star" src="${starImg}"/>
    <br>
    </div>`, // 7

    ` <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-between digit-container-top">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>`, // 8

    `<img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-between digit-container-top">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-end">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>`, // 9

    ` <div class="flex-row" style="gap: 50px">
    
        <div class="flex-col items-center">
        <img class="digit-star" src="${starImg}"/>
    <br>
      <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    </div>
    
        <div><img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <br>
    <div class="flex justify-between digit-container-top">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <div class="flex justify-between">
      <img class="digit-star" src="${starImg}"/>
      <img class="digit-star" src="${starImg}"/>
    </div><br>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/>
    <img class="digit-star" src="${starImg}"/> 
    </div>
        
    </div>`, // 10
    // Add similar lines for other digits
  ];

  if (digit >= 0 && digit <= 10) {
    return digits[digit];
  } else {
    return 'Invalid digit';
  }
}

export function setUpGrade() {
  setTimeout(() => {
    const digitZero = generateDigitWithStars(getGrade());
    const digitContainer = document.getElementById('digitContainer');
    digitContainer.innerHTML = digitZero;
  }, 300);
  setTimeout(() => {
    digitContainer.innerHTML = '';
  }, 3800);
}
