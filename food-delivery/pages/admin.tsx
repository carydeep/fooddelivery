import { Field, Form, Formik } from "formik";
import React from "react";
import foodApi from "./api/foodApi";

function AdminPage() {
  const initialValues = {
    name: "",
    description: "",
    image: "",
    category: 2,
    price: 0,
    weight: 0,
    trend: "none",
  };
  return (
    <div>
      Add food
      <Formik
        initialValues={initialValues}
        onSubmit={async (value: any) => {
          try {
            const data = { ...value, category: Number(value.category) };
            foodApi.createFood(data);
          } catch (error) {}
        }}
      >
        {(formikProps) => {
          return (
            <Form style={{ display: "inline-flex", flexDirection: "column" }}>
              <Field
                type="text"
                name="name"
                placeholder="name something"
              ></Field>
              <Field
                type="text"
                name="description"
                placeholder="add description"
              ></Field>
              <Field
                type="text"
                name="image"
                placeholder="add link image"
              ></Field>
              <Field as="select" name="category">
                <option value={2}>Fast Food</option>
                <option value={3}>Salad</option>
                <option value={4}>Drink</option>
                <option value={5}>Side Dishes</option>
                <option value={6}>Fruit</option>
              </Field>
              <label htmlFor="price">Add price</label>
              <Field type="number" name="price" placeholder="add price"></Field>
              <label htmlFor="weight">Add weight</label>
              <Field
                type="number"
                name="weight"
                placeholder="add weight"
              ></Field>
              <button type="submit">Add</button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default AdminPage;
