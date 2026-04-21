export function validateForm(formData) {
  const errors = {}

  // Sender address
  if (!formData.senderAddress.street.trim()) {
    errors["senderAddress.street"] = "Street address is required"
  }
  if (!formData.senderAddress.city.trim()) {
    errors["senderAddress.city"] = "City is required"
  }
  if (!formData.senderAddress.postCode.trim()) {
    errors["senderAddress.postCode"] = "Post code is required"
  }
  if (!formData.senderAddress.country.trim()) {
    errors["senderAddress.country"] = "Country is required"
  }

  // Client info
  if (!formData.clientName.trim()) {
    errors.clientName = "Client name is required"
  }

  if (!formData.clientEmail.trim()) {
    errors.clientEmail = "Client email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
    errors.clientEmail = "Must be a valid email address"
  }

  // Client address
  if (!formData.clientAddress.street.trim()) {
    errors["clientAddress.street"] = "Street address is required"
  }
  if (!formData.clientAddress.city.trim()) {
    errors["clientAddress.city"] = "City is required"
  }
  if (!formData.clientAddress.postCode.trim()) {
    errors["clientAddress.postCode"] = "Post code is required"
  }
  if (!formData.clientAddress.country.trim()) {
    errors["clientAddress.country"] = "Country is required"
  }

  // Description
  if (!formData.description.trim()) {
    errors.description = "Description is required"
  }

  // Items
  if (!formData.items || formData.items.length === 0) {
    errors.items = "At least one item is required"
  } else {
    formData.items.forEach((item, index) => {
      if (!item.name.trim()) {
        errors[`items[${index}].name`] = "Item name is required"
      }
      if (!item.quantity || item.quantity <= 0) {
        errors[`items[${index}].quantity`] = "Must be greater than 0"
      }
      if (item.price === undefined || item.price < 0) {
        errors[`items[${index}].price`] = "Must be 0 or greater"
      }
    })
  }

  return errors
}

// Check if there are any errors
export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}