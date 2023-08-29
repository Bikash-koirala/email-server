import { Button } from "antd";

export default function ButtonLoader({ loading, form, title }) {
  return (
    <>
      <Button
        loading={loading}
        type="primary"
        htmlType="submit"
        block
        size="large"
        disabled={
          !form.isFieldsTouched(true) ||
          !!form.getFieldsError().filter(({ errors }) => errors.length).length
        }
      >
        {title}
      </Button>
    </>
  );
}
