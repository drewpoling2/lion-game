import {
  snackBarElem,
  snackBarIconElem,
  snackBarTextElem,
} from '../elements-refs';

function notifySnackBar(iconSrc) {
  snackBarElem.classList.remove('hide-element');
  // Add the icon to the power-up div

  if (iconSrc) {
    const icon = document.createElement('img');
    icon.src = iconSrc;
    icon.classList.add('w-full', 'snackbar-img');
    snackBarIconElem.appendChild(icon);
  }
}

export { notifySnackBar };
