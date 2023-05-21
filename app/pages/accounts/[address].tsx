import AccountProfile from "@/components/account/AccountProfile";
import AccountPrompts from "@/components/account/AccountPrompts";
import { ThickDivider } from "@/components/styled";
import Layout from "components/layout";
import { useRouter } from "next/router";

/**
 * Page with an account.
 */
export default function Account() {
  const router = useRouter();
  const { address } = router.query;

  return (
    <Layout>
      {address && (
        <>
          <AccountProfile address={address.toString()} />
          <ThickDivider sx={{ mt: 8, mb: 8 }} />
          <AccountPrompts address={address.toString()} />
        </>
      )}
    </Layout>
  );
}
