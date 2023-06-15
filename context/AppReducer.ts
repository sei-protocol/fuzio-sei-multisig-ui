import { ChainInfo } from '../types';
import { AppContextType } from './AppContext';

export const initialState: AppContextType = {
  chain: {
    addressPrefix: process.env.NEXT_PUBLIC_ADDRESS_PREFIX,
    chainDisplayName: process.env.NEXT_PUBLIC_CHAIN_DISPLAY_NAME,
    chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
    denom: process.env.NEXT_PUBLIC_DENOM,
    displayDenom: process.env.NEXT_PUBLIC_DISPLAY_DENOM,
    displayDenomExponent: parseInt(
      process.env.NEXT_PUBLIC_DISPLAY_DENOM_EXPONENT || '',
      10,
    ),
    explorerLink: process.env.NEXT_PUBLIC_EXPLORER_LINK_TX,
    gasPrice: process.env.NEXT_PUBLIC_GAS_PRICE,
    nodeAddress: process.env.NEXT_PUBLIC_NODE_ADDRESS,
    registryName: process.env.NEXT_PUBLIC_REGISTRY_NAME,
  },
};

export interface ChangeChainAction {
  type: 'changeChain';
  value: ChainInfo;
}

export const AppReducer = (
  state: AppContextType,
  action: ChangeChainAction,
) => {
  switch (action.type) {
    case 'changeChain': {
      return {
        ...state,
        chain: action.value,
      };
    }
  }
};
