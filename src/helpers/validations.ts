export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const passwordRule =
  'Minimum eight characters, at least one letter and one number';

export const getInputFieldRule = (message: string, pattern?: RegExp) => {
  return [
    {
      pattern: pattern && new RegExp(pattern),
      required: true,
      message,
      validateTrigger: 'onSubmit'
    }
  ];
};
