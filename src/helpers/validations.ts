export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const PASSWORD_REGEX = /^(?=.*[0-9a-zA-Z]).{6,}$/;

export const passwordRule = 'Minimum six characters';

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
