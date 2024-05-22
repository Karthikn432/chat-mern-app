import Joi from "joi";

export const authValidation = {
    register: () =>
      Joi.object({
        fullName: Joi.string().min(3).max(50).required().messages({
          "string.empty": "Full Name is required",
          "string.required": "Full Name is required",
          // "string.alphanum": "Full Name must be alphanumeric",
          "string.min": "Full Name must be at least 3 characters long",
          "string.max": "Full Name must be at most 50 characters long",
        }),

        username: Joi.string().min(3).max(25).required().messages({
            "string.empty": "Username is required",
            "string.required": "Username is required",
            // "string.alphanum": "Username must be alphanumeric",
            "string.min": "Username must be at least 3 characters long",
            "string.max": "Username must be at most 25 characters long",
          }),
        // email: Joi.string()
        //   .email({ tlds: { allow: false } })
        //   .required()
        //   .custom((value, helpers) => {
        //     const lowercaseEmail = value.toLowerCase();
  
        //     const allowedTLDs = ['.ai', '.in', '.com', '.net', '.org', '.cc'];
        //     const tld = value.split('.').pop().toLowerCase();
  
        //     if (!allowedTLDs.includes('.' + tld)) {
        //       return helpers.message('Email must end with .ai, .in, .com, .net, .org, .cc');
        //     }
  
        //     const emailPrefix = value.split('@')[0];
        //     const pattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        //     if (!pattern.test(emailPrefix)) {
        //       return helpers.message('Email prefix can only contain letters, numbers, and special characters');
        //     }
  
        //     // Check for uppercase letters
        //     if (value !== lowercaseEmail) {
        //       return helpers.message('Email must not contain uppercase letters');
        //     }
  
        //     return value;
        //   }, 'custom email validation')
        //   .messages({
        //     "string.empty": "Email is required",
        //     "string.required": "Email is required",
        //     "string.email": "Email must be a valid email address",
        //   }),
  
        // mobileNumber: Joi.string()
        //   .required()
        //   .custom((value, helper) => {
        //     // Parse the phone number using libphonenumber-js
        //     const phoneNumber = parsePhoneNumber(value);
        //     // console.log({ phoneNumber })
        //     // Check if the phone number is valid
        //     if (!phoneNumber || !phoneNumber.isValid()) {
        //       return helper.error('phoneNumber.invalidFormat');
        //     }
        //     // Return the original value if no errors
        //     return value;
        //   })
        //   .messages({
        //     'string.empty': 'Mobile number is required',
        //     'phoneNumber.invalidFormat': 'Enter a valid mobile number'
        //   }),
        // whatsappNumber: Joi.string()
        //   .required()
        //   .custom((value, helper) => {
        //     // Parse the phone number using libphonenumber-js
        //     const phoneNumber = parsePhoneNumber(value);
        //     // console.log({ phoneNumber })
        //     // Check if the phone number is valid
        //     if (!phoneNumber || !phoneNumber.isValid()) {
        //       return helper.error('phoneNumber.invalidFormat');
        //     }
        //     // Return the original value if no errors
        //     return value;
        //   })
        //   .messages({
        //     'string.empty': 'Whatsapp number is required',
        //     'phoneNumber.invalidFormat': 'Enter a valid Whatsapp number'
        //   }),
          password: Joi.string()
          .pattern(
              new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9\\s]).{7,11}@?$")
          )
          .custom((value, helpers) => {
              if (/\s/.test(value)) {
                  return helpers.error('string.noWhiteSpaces');
              }
              return value;
          }, 'Password validation')
          .required()
          .min(8)
          .max(12)
          .messages({
              "string.empty": "Password is required",
              "string.pattern.base": "The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
              "string.required": "Password is required",
              'string.noWhiteSpaces': 'Password should not contain white spaces',
              "string.min": "Password must be at least 8 characters long",
          }),

          confirmPassword: Joi.string()
          .valid(Joi.ref("password"))
          .required()
          .messages({
            "any.only": "Confirm Password must match the password",
            "any.required": "Confirm Password is required",
          }),

          gender: Joi.string().valid('male', 'female').required().label("Gender").messages({
            "any.required": "Please Select the gender",
            "any.only": "Only male and female will be accept",
          })
      
        // termsAndConditions: Joi.boolean().invalid(false).required().messages({
        //   "any.invalid": "Please accept the terms and conditions.",
        //   "any.required": "Please accept the terms and conditions.",
        // }),
      }),
  
    login: () =>
      Joi.object({
        username: Joi.string().min(3).max(25).required().messages({
            "string.empty": "Username is required",
            "string.required": "Username is required",
            // "string.alphanum": "Username must be alphanumeric",
            "string.min": "Username must be at least 3 characters long",
            "string.max": "Username must be at most 25 characters long",
          }),
        password: Joi.string()
          .pattern(
            new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}$")
          )
          .required()
          .min(8)
          .messages({
            "string.pattern.base":
              "The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            "string.required": "Password is required",
            "string.min": "Password must be at least 8 characters long",
            "string.empty": "Password is required",
          }),
      }),
    forgotPassword: () =>
      Joi.object({
        email: Joi.string().trim().email({ tlds: false }).messages({
          "string.empty": "Enter valid email address",
          "string.required": "Email address is required",
          "string.email": "Enter valid email address",
        }),
      }),
  
    resetPassword: () =>
      Joi.object({
        newPassword: Joi.string().pattern(
          new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}$")
        ).min(8).required().label("Password").messages({
          "string.pattern.base":
            "The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
          "string.min": "Password must be at least 8 characters long",
          "any.required": "Password is required",
        }),
  
        confirmPassword: Joi.string()
          .valid(Joi.ref("newPassword"))
          .required()
          .label("Confirm Password")
          .messages({
            "any.only": "Confirm Password must match the password",
            "any.required": "Confirm Password is required",
          }),
      }),
  
    otpVerifySchema: () => Joi.object({
      otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),
    }),
  };