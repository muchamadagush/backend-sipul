import * as yup from "yup"
import validationWording from "../../constants/validationWording"

const create = yup
  .object()
  .shape({
    title: yup.string().required(validationWording.required("title")),
    TypeId: yup.string().required(validationWording.required("TypeId")),
  })
  .required()

const update = yup
  .object()
  .shape({
    title: yup.string().required(validationWording.required("title")),
    TypeId: yup.string().nullable(),
  })
  .required()

export default {
  create,
  update,
}
