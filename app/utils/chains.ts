import { Chain, filecoinHyperspace } from "wagmi/chains";
import { stringToAddress } from "./converters";

interface ChainConfig {
  chain: Chain;
  contractAddresses: {
    profile: string;
    prompt: string;
    marketplace: string;
  };
  tablelandTables: {
    prompt: string;
    marketplace: string;
  };
}

/**
 * Get chain configs defined by environment variables.
 */
export function getSupportedChainConfigs(): ChainConfig[] {
  const chainConfigs: ChainConfig[] = [];
  if (
    process.env.NEXT_PUBLIC_HYPERSPACE_PROFILE_CONTRACT_ADDRESS &&
    process.env.NEXT_PUBLIC_HYPERSPACE_PROMPT_CONTRACT_ADDRESS &&
    process.env.NEXT_PUBLIC_HYPERSPACE_MARKETPLACE_CONTRACT_ADDRESS &&
    process.env.NEXT_PUBLIC_HYPERSPACE_PROMPT_TABLELAND_TABLE &&
    process.env.NEXT_PUBLIC_HYPERSPACE_MARKETPLACE_TABLELAND_TABLE
  ) {
    chainConfigs.push({
      chain: filecoinHyperspace,
      contractAddresses: {
        profile: process.env.NEXT_PUBLIC_HYPERSPACE_PROFILE_CONTRACT_ADDRESS,
        prompt: process.env.NEXT_PUBLIC_HYPERSPACE_PROMPT_CONTRACT_ADDRESS,
        marketplace:
          process.env.NEXT_PUBLIC_HYPERSPACE_MARKETPLACE_CONTRACT_ADDRESS,
      },
      tablelandTables: {
        prompt: process.env.NEXT_PUBLIC_HYPERSPACE_PROMPT_TABLELAND_TABLE,
        marketplace:
          process.env.NEXT_PUBLIC_HYPERSPACE_MARKETPLACE_TABLELAND_TABLE,
      },
    });
  }
  return chainConfigs;
}

/**
 * Get chains using supported chain configs.
 */
export function getSupportedChains(): Chain[] {
  return getSupportedChainConfigs().map((chainConfig) => chainConfig.chain);
}

/**
 * Get the first chain config from supported chains.
 */
export function getDefaultSupportedChainConfig(): ChainConfig {
  const chainConfigs = getSupportedChainConfigs();
  if (chainConfigs.length === 0) {
    throw new Error("Supported chain config is not found");
  } else {
    return chainConfigs[0];
  }
}

/**
 * Return config of specified chain if it supported, otherwise return config of default supported chain.
 */
export function chainToSupportedChainConfig(
  chain: Chain | undefined
): ChainConfig {
  for (const config of getSupportedChainConfigs()) {
    if (config.chain.id === chain?.id) {
      return config;
    }
  }
  return getDefaultSupportedChainConfig();
}

/**
 * Return id of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainId(
  chain: Chain | undefined
): number | undefined {
  return chainToSupportedChainConfig(chain).chain.id;
}

/**
 * Return native currency symbol of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainNativeCurrencySymbol(
  chain: Chain | undefined
): string | undefined {
  return chainToSupportedChainConfig(chain).chain.nativeCurrency.symbol;
}

/**
 * Return profile contract address of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainProfileContractAddress(
  chain: Chain | undefined
): `0x${string}` | undefined {
  return stringToAddress(
    chainToSupportedChainConfig(chain).contractAddresses.profile
  );
}

/**
 * Return prompt contract address of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainPromptContractAddress(
  chain: Chain | undefined
): `0x${string}` | undefined {
  return stringToAddress(
    chainToSupportedChainConfig(chain).contractAddresses.prompt
  );
}

/**
 * Return marketplace contract address of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainMarketplaceContractAddress(
  chain: Chain | undefined
): `0x${string}` | undefined {
  return stringToAddress(
    chainToSupportedChainConfig(chain).contractAddresses.marketplace
  );
}

/**
 * Return prompt tableland table of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainPromptTablelandTable(
  chain: Chain | undefined
): string | undefined {
  return chainToSupportedChainConfig(chain).tablelandTables.prompt;
}

/**
 * Return marketplace tableland table of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainMarketplaceTablelandTable(
  chain: Chain | undefined
): string | undefined {
  return chainToSupportedChainConfig(chain).tablelandTables.marketplace;
}
