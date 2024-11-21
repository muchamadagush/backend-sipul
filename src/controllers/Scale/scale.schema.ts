import * as yup from "yup"
import validationWording from "../../constants/validationWording"

const create = yup
  .object()
  .shape({
    title: yup.string().required(validationWording.required("title")),
  })
  .required()

const update = yup
  .object()
  .shape({
    title: yup.string().required(validationWording.required("title")),
  })
  .required()

export default {
  create,
  update,
}
