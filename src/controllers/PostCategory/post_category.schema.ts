import * as yup from "yup"
import validationWording from "../../constants/validationWording"

const create = yup
  .object()
  .shape({
    postId: yup.string().required(validationWording.required("postId")),
    categoryId: yup.string().required(validationWording.required("categoryId")),
  })
  .required()

export default {
  create,
}
