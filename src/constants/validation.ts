export const passwordValidation =
  /^(?!.*\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/

export const passwordValidationMessage =
  "Password must be 8 or more characters with a mix of letters, numbers & symbols and does not contain email address"

export const passwordHint =
  "Use 8 or more characters with a mix of letters, numbers & symbols and does not contain email address"
