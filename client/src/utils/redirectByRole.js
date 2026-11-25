export default function redirectByRole(role) {
  if (role === "lecturer") return "/lecturer";
  if (role === "admin") return "/admin";
  return "/student";
}
