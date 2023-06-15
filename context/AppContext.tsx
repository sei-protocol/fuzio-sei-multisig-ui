import React, { useEffect, createContext, useContext, useReducer } from 'react';

import { AppReducer, ChangeChainAction, initialState } from './AppReducer';
import { ChainInfo } from '../types';

export interface AppContextType {
  chain: ChainInfo;
}

const AppContext = createContext<{
  state: AppContextType;
  dispatch: React.Dispatch<ChangeChainAction>;
}>({ dispatch: () => {}, state: initialState });

function getChainInfoFromUrl(): ChainInfo {
  const url = location.search;
  const params = new URLSearchParams(url);
  const chainInfo: ChainInfo = {
    addressPrefix: decodeURIComponent(params.get('addressPrefix') || ''),
    chainDisplayName: decodeURIComponent(params.get('chainDisplayName') || ''),
    chainId: decodeURIComponent(params.get('chainId') || ''),
    denom: decodeURIComponent(params.get('denom') || ''),
    displayDenom: decodeURIComponent(params.get('displayDenom') || ''),
    displayDenomExponent: parseInt(
      decodeURIComponent(params.get('displayDenomExponent') || ''),
      10,
    ),
    explorerLink: decodeURIComponent(params.get('explorerLink') || ''),
    gasPrice: decodeURIComponent(params.get('gasPrice') || ''),
    nodeAddress: decodeURIComponent(params.get('nodeAddress') || ''),
    registryName: decodeURIComponent(params.get('registryName') || ''),
  };

  return chainInfo;
}

function setChainInfoParams(chainInfo: ChainInfo) {
  const params = new URLSearchParams();

  const keys = Object.keys(chainInfo) as Array<keyof ChainInfo>;

  keys.forEach((value: keyof ChainInfo) => {
    params.set(value, encodeURIComponent(chainInfo[value] || ''));
  });

  window.history.replaceState({}, '', `${location.pathname}?${params}`);
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  let existingState;
  if (typeof window !== 'undefined') {
    const storedState = localStorage.getItem('state');
    if (storedState) {
      existingState = JSON.parse(storedState);
    }

    const urlChainInfo = getChainInfoFromUrl();

    // query params should override saved state
    if (urlChainInfo.chainId) {
      console.log('setting state from url');
      existingState = { chain: urlChainInfo };
    }
  }
  const [state, dispatch] = useReducer(
    AppReducer,
    existingState ? existingState : initialState,
  );

  const contextValue = { dispatch, state };

  useEffect(() => {
    if (state && state !== initialState) {
      localStorage.setItem('state', JSON.stringify(state));
      setChainInfoParams(state.chain);
    }
  }, [state]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
export function useAppContext() {
  return useContext(AppContext);
}
