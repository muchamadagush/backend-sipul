import * as yup from "yup";
import validationWording from "../../constants/validationWording";

const create = yup
  .object()
  .shape({
    title: yup.string().required(validationWording.required("title")),
    description: yup
      .string()
      .required(validationWording.required("description")),
    status: yup.string().required(validationWording.required("status")),
    thumbnail: yup.string().nullable(),
    categoryIds: yup.array().of(yup.string().nullable()),
  })
  .required();

export default {
  create,
};
