import Joi from "joi";

const updateUserValidate = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  email: Joi.string().email().optional(),
}).options({ abortEarly: false });

const changePasswordValidate = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
    .message(
      "New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match the new password",
    }),
}).options({ abortEarly: false });

export { updateUserValidate, changePasswordValidate };
