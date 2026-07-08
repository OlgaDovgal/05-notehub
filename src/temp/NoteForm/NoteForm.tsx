import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import { queryClient } from "../../main";
import toast from "react-hot-toast";
interface NoteFormProps {
  onClose: () => void;
}
const Schema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 symbols")
    .max(50, "Title must be less than 50 symbols")
    .required("Title must be required"),
  content: Yup.string().max(500, "Content must be less than 500 symbols"),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Please, choose one of this tags",
    )
    .required("Tag must be required"),
});
export default function NoteForm({ onClose }: NoteFormProps) {
  interface CreateNoteFormValues {
    title: string;
    content: string;
    tag: string;
  }
  const initialValues: CreateNoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      onClose();
      toast.success("Note is successfully created!");
    },
  });
  const handleSubmit = (
    values: CreateNoteFormValues,
    actions: FormikHelpers<CreateNoteFormValues>,
  ) => {
    mutation.mutate(values);
    actions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={Schema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            id="content"
            as="textarea"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
