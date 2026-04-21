// Generates an ID like "RT3080"
export function generateId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)]
  const randomNumbers = Math.floor(1000 + Math.random() * 9000)
  return `${randomLetters}${randomNumbers}`
}