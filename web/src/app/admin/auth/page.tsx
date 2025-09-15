import { AuthButton } from "@/components/admin/auth/AuthButton";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { InputField } from "@/components/admin/auth/InputField";

export default function LoginPage() {
  return (
    <AuthLayout title="IQS">
      <form className="w-full flex flex-col gap-6">
        <InputField
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
        />
        <InputField
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          required
        />
        <AuthButton type="submit">Sign In</AuthButton>
      </form>
    </AuthLayout>
  );
}
