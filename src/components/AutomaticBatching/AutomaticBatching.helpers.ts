export function fetchSomthing(delay = 100) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
