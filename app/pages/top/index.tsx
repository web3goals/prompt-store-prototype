import AccountCard from "@/components/account/AccountCard";
import EntityList from "@/components/entity/EntityList";
import { profileContractAbi } from "@/contracts/abi/profileContract";
import SellerTablelandEntity from "@/entities/tableland/SellerTablelandEntity";
import ProfileUriDataEntity from "@/entities/uri/ProfileUriDataEntity";
import useSellersLoader from "@/hooks/useSellersLoader";
import useUriDataLoader from "@/hooks/useUriDataLoader";
import { chainToSupportedChainProfileContractAddress } from "@/utils/chains";
import { stringToAddress } from "@/utils/converters";
import { SxProps, Typography } from "@mui/material";
import Layout from "components/layout";
import { ethers } from "ethers";
import { useContractRead, useNetwork } from "wagmi";

/**
 * Page with the top authors.
 */
export default function TopAuthors() {
  const { sellers } = useSellersLoader();

  return (
    <Layout>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🏆 Top author
      </Typography>
      <Typography textAlign="center" mt={1}>
        who created the most purchasable clues
      </Typography>
      <EntityList
        entities={sellers}
        renderEntityCard={(seller: SellerTablelandEntity, index) => (
          <TopAuthorCard
            key={index}
            address={seller.id}
            sales={Number(seller.sales)}
          />
        )}
        noEntitiesText="😐 no authors"
        sx={{ mt: 4 }}
      />
    </Layout>
  );
}

function TopAuthorCard(props: {
  address: string;
  sales: number;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();

  /**
   * Define profile uri data
   */
  const { data: profileUri } = useContractRead({
    address: chainToSupportedChainProfileContractAddress(chain),
    abi: profileContractAbi,
    functionName: "getURI",
    args: [stringToAddress(props.address) || ethers.constants.AddressZero],
  });
  const { data: profileUriData } =
    useUriDataLoader<ProfileUriDataEntity>(profileUri);

  return (
    <AccountCard
      address={props.address}
      profileUriData={profileUriData}
      sales={props.sales}
    />
  );
}
