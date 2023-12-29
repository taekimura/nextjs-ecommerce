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
