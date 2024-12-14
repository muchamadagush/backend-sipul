import * as yup from 'yup';
import validationWording from '../../constants/validationWording';

const create = yup
  .object()
  .shape({
    id: yup.string().required(validationWording.required('id')),
    weight: yup.number().required(validationWording.required('weight')),
  })
  .required();

const update = yup
  .object()
  .shape({
    title: yup.string().required(validationWording.required('title')),
  })
  .required();

export default {
  create,
  update,
};
