export function getUsername(): string {
  const existing = sessionStorage.getItem('username');
  if (existing) return existing;

  const generated = `User${Math.floor(Math.random() * 1000)}`;
  sessionStorage.setItem('username', generated);
  return generated;
}