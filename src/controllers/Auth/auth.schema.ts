import * as yup from 'yup'
import validationWording from '../../constants/validationWording'

const login = yup
  .object()
  .shape({
    email: yup
      .string()
      .email(validationWording.invalid("email"))
      .required(validationWording.required("email")),
    password: yup
      .string()
      .required(validationWording.required('Password')),
  })
  .required()

export default {
  login,
}
