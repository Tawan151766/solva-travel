// Input validation utilities

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }
  
  return { isValid: true };
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
}

export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 8 || cleanPhone.length > 15) {
    return { isValid: false, error: 'Phone number must be between 8-15 digits' };
  }
  
  return { isValid: true };
}

export function validateName(name, fieldName = 'Name') {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, error: `${fieldName} is too long` };
  }
  
  // Check for potentially malicious content
  if (/<script|javascript:|on\w+=/i.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }
  
  return { isValid: true, value: trimmedName };
}

export function validateText(text, fieldName = 'Text', maxLength = 1000) {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const trimmedText = text.trim();
  
  if (trimmedText.length === 0) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }
  
  if (trimmedText.length > maxLength) {
    return { isValid: false, error: `${fieldName} is too long (max ${maxLength} characters)` };
  }
  
  // Check for potentially malicious content
  if (/<script|javascript:|on\w+=/i.test(trimmedText)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }
  
  return { isValid: true, value: trimmedText };
}

export function validateDate(dateString, fieldName = 'Date') {
  if (!dateString) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: `${fieldName} is not a valid date` };
  }
  
  // Check if date is not too far in the past or future
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 1, 0, 1); // 1 year ago
  const maxDate = new Date(now.getFullYear() + 5, 11, 31); // 5 years from now
  
  if (date < minDate || date > maxDate) {
    return { isValid: false, error: `${fieldName} must be within a reasonable range` };
  }
  
  return { isValid: true, value: date };
}

export function validateNumber(number, fieldName = 'Number', min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (number === undefined || number === null) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const num = Number(number);
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (num < min || num > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}` };
  }
  
  return { isValid: true, value: num };
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

// Comprehensive validation for user registration
export function validateUserRegistration(userData) {
  const errors = {};
  
  // Validate first name
  const firstNameValidation = validateName(userData.firstName, 'First name');
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error;
  }
  
  // Validate last name
  const lastNameValidation = validateName(userData.lastName, 'Last name');
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error;
  }
  
  // Validate email
  const emailValidation = validateEmail(userData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  // Validate password
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }
  
  // Validate phone (optional)
  if (userData.phone) {
    const phoneValidation = validatePhone(userData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      firstName: firstNameValidation.isValid ? firstNameValidation.value : userData.firstName,
      lastName: lastNameValidation.isValid ? lastNameValidation.value : userData.lastName,
      email: userData.email?.toLowerCase().trim(),
      phone: userData.phone?.trim(),
    }
  };
}

// Comprehensive validation for tour requests
export function validateTourRequest(requestData) {
  const errors = {};
  
  // Validate contact name
  const nameValidation = validateName(requestData.contactName, 'Contact name');
  if (!nameValidation.isValid) {
    errors.contactName = nameValidation.error;
  }
  
  // Validate email
  const emailValidation = validateEmail(requestData.contactEmail);
  if (!emailValidation.isValid) {
    errors.contactEmail = emailValidation.error;
  }
  
  // Validate phone
  const phoneValidation = validatePhone(requestData.contactPhone);
  if (!phoneValidation.isValid) {
    errors.contactPhone = phoneValidation.error;
  }
  
  // Validate destination
  const destinationValidation = validateText(requestData.destination, 'Destination', 100);
  if (!destinationValidation.isValid) {
    errors.destination = destinationValidation.error;
  }
  
  // Validate dates
  const startDateValidation = validateDate(requestData.startDate, 'Start date');
  if (!startDateValidation.isValid) {
    errors.startDate = startDateValidation.error;
  }
  
  const endDateValidation = validateDate(requestData.endDate, 'End date');
  if (!endDateValidation.isValid) {
    errors.endDate = endDateValidation.error;
  }
  
  // Check if end date is after start date
  if (startDateValidation.isValid && endDateValidation.isValid) {
    if (endDateValidation.value <= startDateValidation.value) {
      errors.endDate = 'End date must be after start date';
    }
  }
  
  // Validate number of people
  const peopleValidation = validateNumber(requestData.numberOfPeople, 'Number of people', 1, 50);
  if (!peopleValidation.isValid) {
    errors.numberOfPeople = peopleValidation.error;
  }
  
  // Validate budget (optional)
  if (requestData.budget) {
    const budgetValidation = validateNumber(requestData.budget, 'Budget', 0, 10000000);
    if (!budgetValidation.isValid) {
      errors.budget = budgetValidation.error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      contactName: nameValidation.isValid ? nameValidation.value : requestData.contactName,
      contactEmail: requestData.contactEmail?.toLowerCase().trim(),
      contactPhone: requestData.contactPhone?.trim(),
      destination: destinationValidation.isValid ? destinationValidation.value : requestData.destination,
      startDate: startDateValidation.isValid ? startDateValidation.value : requestData.startDate,
      endDate: endDateValidation.isValid ? endDateValidation.value : requestData.endDate,
      numberOfPeople: peopleValidation.isValid ? peopleValidation.value : requestData.numberOfPeople,
      budget: requestData.budget ? Number(requestData.budget) : null,
      accommodation: requestData.accommodation ? sanitizeInput(requestData.accommodation) : null,
      transportation: requestData.transportation ? sanitizeInput(requestData.transportation) : null,
      activities: requestData.activities ? sanitizeInput(requestData.activities) : null,
      specialRequirements: requestData.specialRequirements ? sanitizeInput(requestData.specialRequirements) : null,
      description: requestData.description ? sanitizeInput(requestData.description) : null,
    }
  };
}