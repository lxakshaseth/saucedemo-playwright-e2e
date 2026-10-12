export const checkoutUserData = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '000 00',
  },
  emptyFirstName: {
    firstName: '',
    lastName: 'Doe',
    zipCode: '000 00',
  },
  emptyLastName: {
    firstName: 'John',
    lastName: '',
    zipCode: '000 00',
  },
  emptyZipCode: {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '',
  },
};

export const testInputs = {
  specialCharacters: '1234*/-+Test.,?ABC@[]56789',
  longText: 'A'.repeat(100),
  sqlInjection: "'; DROP TABLE users; --",
  xssAttempt: '<script>alert("XSS")</script>',
};
