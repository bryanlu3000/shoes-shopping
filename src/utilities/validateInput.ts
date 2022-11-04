import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

interface Input {
  email?: string;
  password?: string;
  matchPassword?: string;
}

export default function validateInput(input: Input, isSignup: boolean): Input {
  const error = {} as Input;

  if (!input.email) {
    error.email = "Email is required.";
  } else if (!isEmail(input.email)) {
    error.email = "Please input a valid email.";
  }

  if (!input.password) {
    error.password = "Password is required.";
  } else if (
    !isStrongPassword(input.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    error.password =
      "Please input a valid password with at least 8 characters, 1 lowercase, 1 uppercase and 1 number.";
  }

  if (isSignup) {
    if (!input.matchPassword) {
      error.matchPassword = "Please retype the password.";
    } else if (input.password !== input.matchPassword) {
      error.matchPassword =
        "Passwords are not matched. Please enter the password again.";
    }
  }

  return error;
}
