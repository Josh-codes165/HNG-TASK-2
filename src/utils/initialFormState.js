export const initialFormState = {
  description: "",
  createdAt: new Date().toISOString().split("T")[0],
  paymentTerms: 30,
  clientName: "",
  clientEmail: "",
  senderAddress: {
    street: "",
    city: "",
    postCode: "",
    country: "",
  },
  clientAddress: {
    street: "",
    city: "",
    postCode: "",
    country: "",
  },
  items: [],
}

export const initialItem = {
  name: "",
  quantity: 1,
  price: 0,
  total: 0,
}