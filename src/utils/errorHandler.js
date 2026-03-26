// Firebase error codes mapped to user-friendly messages
const errorMessages = {
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/email-already-in-use': 'This email is already registered. Please sign in or use a different email.',
  'auth/weak-password': 'Password is too weak. Use at least 6 characters with letters and numbers.',
  'auth/user-not-found': 'No account found with this email. Please sign up.',
  'auth/wrong-password': 'Invalid email or password. Please try again.',
  'auth/user-disabled': 'This account has been disabled. Contact support for help.',
  'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
  'auth/operation-not-allowed': 'Email/password authentication is not enabled.',
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  'auth/internal-error': 'An error occurred. Please try again.',
};

export const getFirebaseErrorMessage = (error) => {
  // Handle Firebase error with code
  if (error?.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  // Handle error message containing Firebase error code
  if (error?.message) {
    const codeMatch = error.message.match(/auth\/([a-z-]+)/);
    if (codeMatch && codeMatch[1]) {
      const code = `auth/${codeMatch[1]}`;
      if (errorMessages[code]) {
        return errorMessages[code];
      }
    }
  }

  // Fallback to default message
  return 'An error occurred. Please try again.';
};
