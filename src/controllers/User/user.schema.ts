import * as yup from "yup"
import validationWording from "../../constants/validationWording"

const create = yup
  .object()
  .shape({
    fullName: yup.string().required(validationWording.required("fullName")),
    role: yup.string().required(validationWording.required("role")),
    email: yup
      .string()
      .email(validationWording.invalid("email"))
      .required(validationWording.required("email")),
    status: yup.string().required(validationWording.required("status")),
    newPassword: yup
      .string()
      .required(validationWording.required("Password wajib diisi"))
      .min(8, validationWording.minLength(8))
      .matches(/\d+/, {
        message: "Password harus mengandung angka",
      })
      .matches(/[a-z]+/, {
        message: "Password harus mengandung huruf kecil",
      })
      .matches(/[A-Z]+/, {
        message: "Password harus mengandung huruf besar",
      }),
    confirmNewPassword: yup.string().when("newPassword", {
      is: (newPassword: string) => !!newPassword,
      then: (schema: any) =>
        schema
          .min(8, validationWording.minLength(8))
          .oneOf([yup.ref("newPassword")], "Password konfirmasi tidak sama")
          .required(
            validationWording.required("Password konfirmasi wajib diisi")
          ),
    }),
  })
  .required()

const createPassword = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, validationWording.minLength(8))
    .oneOf([yup.ref("confirmNewPassword")], "Password tidak sama")
    .matches(/\d+/, {
      message: "Password harus mengandung angka",
    })
    .matches(/[a-z]+/, {
      message: "Password harus mengandung huruf kecil",
    })
    .matches(/[A-Z]+/, {
      message: "Password harus mengandung huruf besar",
    }),
  confirmNewPassword: yup.string().when("newPassword", {
    is: (newPassword: string) => !!newPassword,
    then: (schema: any) =>
      schema
        .min(8, validationWording.minLength(8))
        .oneOf([yup.ref("newPassword")], "Password konfirmasi tidak sama")
        .required(
          validationWording.required("Password konfirmasi wajib diisi")
        ),
  }),
})

const update = yup
  .object()
  .shape({
    fullName: yup.string().required(validationWording.required("fullName")),
    role: yup.string().required(validationWording.required("role")),
    email: yup
      .string()
      .email(validationWording.invalid("email"))
      .required(validationWording.required("email")),
    status: yup.string().required(validationWording.required("status")),
    newPassword: yup
      .string()
      .min(8, validationWording.minLength(8))
      .matches(/\d+/, {
        message: "Password harus mengandung angka",
      })
      .matches(/[a-z]+/, {
        message: "Password harus mengandung huruf kecil",
      })
      .matches(/[A-Z]+/, {
        message: "Password harus mengandung huruf besar",
      }),
    confirmNewPassword: yup.string().when("newPassword", {
      is: (newPassword: string) => !!newPassword,
      then: (schema: any) =>
        schema
          .min(8, validationWording.minLength(8))
          .oneOf([yup.ref("newPassword")], "Password konfirmasi tidak sama")
          .required(
            validationWording.required("Password konfirmasi wajib diisi")
          ),
    }),
  })
  .required()

export default {
  create,
  createPassword,
  update,
}
