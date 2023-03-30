import openPopup from './popup.js';
import updatePreview from './upload-preview.js';
import openStatusPopup from './status-popup.js';
openStatusPopup('error');

/**
 * @type {HTMLFormElement}
 */
const form = document.querySelector('.img-upload__form');
/**
 * @type {HTMLDivElement}
 */
const popup = form.querySelector('.img-upload__overlay');

// @ts-ignore
const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

/**
 * @param {string} message
 * @param {(tags: string[]) => boolean} validate
 */
const addHashTagsValidator = (message, validate) => {
  pristine.addValidator(form.hashtags, (value) => {
    const tags = value.toLowerCase().split(' ').filter(Boolean);

    return validate(tags);
  }, message, 1, true);
};

/**
 * @param {string} message
 * @param {(description: string) => boolean} validate
 */
const addDescriptionValidator = (message, validate) => {
  pristine.addValidator(form.description, validate, message);
};

/**
 * @param {Event & {target: HTMLInputElement}} event
 */
const onFormChange = (event) => {
  if (event.target === form.filename) {
    const data = event.target.files.item[0];
    updatePreview(data);
    openPopup(popup);
  }
};

//Сбросит подсказки после закрытия формы
const onFormReset = () => {
  pristine.reset();
};

/**
 * @param {SubmitEvent} event
 */
const onFormSubmit = (event) => {
  event.preventDefault();

  pristine.validate();
};

addHashTagsValidator(
  'Хештеги должны начинаться с символа # (решетка)',
  (tags) => tags.every((tag) => tag.startsWith('#'))
);

addHashTagsValidator(
  'После символа # (решетка) должны идти буквы/цифры, хештеги разделяются пробелом',
  (tags) => tags.every((tag) => /^#[a-zа-яё0-9]+$/.test(tag))
);

addHashTagsValidator(
  'Максимальная длина хештега 20 символов',
  (tags) => tags.every((tag) => tag.length <= 20)
);

addHashTagsValidator(
  'Укажите не более 5 хештегов',
  (tags) => tags.length <= 5
);

addHashTagsValidator(
  'Хештеги не должны повторятся',
  (tags) => tags.length === new Set(tags).size
);

addDescriptionValidator(
  'Длина описание не должна превышать 140 символов',
  (description) => description.length <= 140
);

form.addEventListener('change', onFormChange);
form.addEventListener('reset', onFormReset);
form.addEventListener('submit', onFormSubmit);
