import { StargateClient } from '@cosmjs/stargate';
import { assert } from '@cosmjs/utils';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import GearIcon from '../icons/Gear';
import Button from '../inputs/Button';
import Input from '../inputs/Input';
import Select from '../inputs/Select';
import StackableContainer from '../layout/StackableContainer';
import {
  RegistryChainApisRpc,
  RegistryChainExplorer,
  getAssetsFromRegistry,
  getChainFromRegistry,
} from './chainregistry';

interface ChainOption {
  label: string;
  value: number;
}

interface GithubChainRegistryItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

const chainsUrl = 'https://api.github.com/repos/cosmos/chain-registry/contents';
const testnetsUrl =
  'https://api.github.com/repos/cosmos/chain-registry/contents/testnets';

const ChainSelect = () => {
  const router = useRouter();
  const { state, dispatch } = useAppContext();

  // UI State
  const [chainArray, setChainArray] = useState<GithubChainRegistryItem[]>([]);
  const [chainOptions, setChainOptions] = useState<ChainOption[]>([]);
  const [chainError, setChainError] = useState<string | null>(null);
  const [showAuxView, setShowAuxView] = useState<
    null | 'settings' | 'confirmRedirect'
  >(null);
  const [storedOption, setStoredOption] = useState<ChainOption | null>(null);
  const [selectValue, setSelectValue] = useState({
    label: 'Loading...',
    value: -1,
  });

  // Chain State
  const [tempChainId, setChainId] = useState('sei');
  const [tempNodeAddress, setNodeAddress] = useState('https://sei-rpc.polkachu.com/');
  const [tempAddressPrefix, setAddressPrefix] = useState('sei');
  const [tempDenom, setDenom] = useState(state.chain.denom);
  const [tempDisplayDenom, setDisplayDenom] = useState(
    state.chain.displayDenom,
  );
  const [tempDisplayDenomExponent, setDisplayDenomExponent] = useState(
    state.chain.displayDenomExponent,
  );
  const [tempGasPrice, setGasPrice] = useState(state.chain.gasPrice);
  const [tempChainName, setChainName] = useState(state.chain.chainDisplayName);
  const [tempRegistryName, setRegistryName] = useState(
    state.chain.registryName,
  );
  const [tempExplorerLink, setExplorerLink] = useState(
    state.chain.explorerLink,
  );

  const getGhJson = useCallback(async () => {
    // getting chain info from this repo: https://github.com/cosmos/chain-registry
    try {
      const [{ data: chains }, { data: testnets }] = await Promise.all([
        axios.get(chainsUrl),
        axios.get(testnetsUrl),
      ]);

      const allChains: GithubChainRegistryItem[] = [
        ...chains,
        ...testnets,
      ].filter((item: GithubChainRegistryItem) => {
        return (
          item.type == 'dir' &&
          !item.name.startsWith('.') &&
          !item.name.startsWith('_')
        );
      });
      setChainArray(allChains);

      const options = allChains.map(
        ({ name }: GithubChainRegistryItem, index: number) => ({
          label: name,
          value: index,
        }),
      );
      setChainOptions(options);

      assert(state.chain.registryName, 'registryName missing');
      setSelectValue(findExistingOption(options, state.chain.registryName));
    } catch (error: any) {
      console.log(error);
      setShowAuxView('settings');
      setChainError(error.message);
    }
  }, [state.chain.registryName]);

  useEffect(() => {
    getGhJson();
  }, [getGhJson]);

  useEffect(() => {
    // set settings form fields to new values
    setChainId('sei');
    setNodeAddress('https://sei-rpc.polkachu.com/');
    setAddressPrefix('sei');
    setDenom(state.chain.denom);
    setDisplayDenom(state.chain.displayDenom);
    setDisplayDenomExponent(state.chain.displayDenomExponent);
    setGasPrice(state.chain.gasPrice);
    setChainName(state.chain.chainDisplayName);
    setExplorerLink(state.chain.explorerLink);
    setRegistryName(state.chain.registryName);
  }, [state]);

  const findExistingOption = (options: ChainOption[], registryName: string) => {
    const index = options.findIndex((option) => option.label === registryName);
    if (index >= 0) {
      return options[index];
    }
    return {
      label:
        registryName === process.env.NEXT_PUBLIC_REGISTRY_NAME
          ? registryName
          : 'unknown chain',
      value: -1,
    };
  };

  const getChainInfo = async (chainOption: GithubChainRegistryItem) => {
    setChainError(null);

    try {
      const chainData = await getChainFromRegistry(chainOption.path);
      const assets = await getAssetsFromRegistry(chainOption.path);
      const firstAsset = assets[0];

      const nodeAddress = ('https://sei-rpc.polkachu.com/');
      const explorerLink = getExplorerFromArray(chainData.explorers);
      const denom = firstAsset.base || '';
      const displayDenom = firstAsset.symbol || '';

      const displayUnit = firstAsset.denom_units.find(
        (u) => u.denom == firstAsset.display,
      );
      const displayDenomExponent = displayUnit?.exponent ?? 6;

      const feeToken = chainData.fees.fee_tokens.find(
        (token) => token.denom == denom,
      ) ?? { denom };
      const gasPrice =
        feeToken.average_gas_price ??
        feeToken.low_gas_price ??
        feeToken.high_gas_price ??
        feeToken.fixed_min_gas_price ??
        0.03;
      const formattedGasPrice = firstAsset ? `${gasPrice}${denom}` : '';

      // change app state
      dispatch({
        type: 'changeChain',
        value: {
          addressPrefix: chainData.bech32_prefix,
          chainDisplayName: chainData.pretty_name,
          chainId: chainData.chain_id,
          denom,
          displayDenom,
          displayDenomExponent,
          explorerLink,
          gasPrice: formattedGasPrice,
          nodeAddress,
          registryName: chainOption.name,
        },
      });

      setShowAuxView(null);
    } catch (error) {
      if (error instanceof Error) {
        setChainError(error.message);
      } else {
        setChainError('Error getting chain info');
      }

      console.error('Error getting chain info', error);
      setShowAuxView('settings');
    }
  };

  const getExplorerFromArray = (
    explorers: readonly RegistryChainExplorer[],
  ) => {
    return explorers[0]?.tx_page ?? '';
  };

  const getNodeFromArray = async (
    nodeArray: readonly RegistryChainApisRpc[],
  ) => {
    // only return https connections
    const secureNodes = nodeArray
      .filter((node) => node.address.startsWith('https://'))
      .map(({ address }) => address);

    if (secureNodes.length === 0) {
      throw new Error('No SSL enabled RPC nodes available for this chain');
    }

    for (const node of secureNodes) {
      try {
        // test client connection
        const client = await StargateClient.connect(node);
        await client.getHeight();
        return node;
      } catch {}
    }

    throw new Error('No RPC nodes available for this chain');
  };

  const changeChain = (option: ChainOption) => {
    const index = chainOptions.findIndex((opt) => opt.label === option.label);
    setSelectValue(chainOptions[index]);
    getChainInfo(chainArray[option.value]);
  };

  const onChainSelect = (option: ChainOption) => {
    if (router.pathname !== '/' && option.label !== selectValue.label) {
      setStoredOption(option);
      setShowAuxView('confirmRedirect');
      return;
    }

    changeChain(option);
    setStoredOption(null);
  };

  const redirectAndChangeChain = () => {
    setShowAuxView(null);

    if (storedOption) {
      changeChain(storedOption);
      setStoredOption(null);
    }

    router.push('/');
  };

  const setChainFromForm = async () => {
    setChainError(null);
    try {
      // test client connection
      assert(tempNodeAddress, 'tempNodeAddress missing');
      const client = await StargateClient.connect(tempNodeAddress);
      await client.getHeight();

      // change app state
      dispatch({
        type: 'changeChain',
        value: {
          addressPrefix: tempAddressPrefix,
          chainDisplayName: tempChainName,
          chainId: tempChainId,
          denom: tempDenom,
          displayDenom: tempDisplayDenom,
          displayDenomExponent: tempDisplayDenomExponent,
          explorerLink: tempExplorerLink,
          gasPrice: tempGasPrice,
          nodeAddress: tempNodeAddress,
          registryName: tempRegistryName,
        },
      });
      assert(tempRegistryName, 'tempRegistryName missing');
      const selectedOption = findExistingOption(chainOptions, tempRegistryName);
      setSelectValue(selectedOption);
      setShowAuxView(null);
    } catch (error: any) {
      console.log(error);
      setShowAuxView('settings');
      setChainError(error.message);
    }
  };

  return (
    <div className="chain-select-container">
      <StackableContainer
        lessPadding
        base
      >
        <p>Chain select</p>
        <div className="flex">
          <div className="select-parent">
            <Select
              options={chainOptions}
              onChange={onChainSelect}
              value={selectValue}
              name="chain-select"
            />
          </div>
          {showAuxView ? (
            <button
              className="remove"
              onClick={() => {
                setShowAuxView(null);
                setStoredOption(null);
              }}
            >
              ✕
            </button>
          ) : (
            <button onClick={() => setShowAuxView('settings')}>
              <GearIcon color="white" />
            </button>
          )}
        </div>
        {showAuxView === 'settings' ? (
          <>
            {chainError && <p className="error">{chainError}</p>}
            <StackableContainer
              lessPadding
              lessMargin
              lessRadius
            >
              <p>Settings</p>
              <div className="settings-group">
                <Input
                  width="48%"
                  value={tempChainName}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => setChainName(e.target.value)}
                  label="Chain Name"
                />

                <Input
                  width="48%"
                  value={tempChainId}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => setChainId(e.target.value)}
                  label="Chain ID"
                />
              </div>
              <div className="settings-group">
                <Input
                  width="48%"
                  value={tempAddressPrefix}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => setAddressPrefix(e.target.value)}
                  label="Bech32 Prefix (address prefix)"
                />
                <Input
                  width="48%"
                  value={tempNodeAddress}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => setNodeAddress(e.target.value)}
                  label="RPC Node URL (must be https)"
                />
              </div>
              <div className="settings-group">
                <Input
                  width="48%"
                  value={tempDisplayDenom}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => setDisplayDenom(e.target.value)}
                  label="Display Denom"
                />
                <Input
                  width="48%"
                  value={tempDenom}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => setDenom(e.target.value)}
                  label="Base Denom"
                />
              </div>
              <div className="settings-group">
                <Input
                  width="48%"
                  value={tempDisplayDenomExponent}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => setDisplayDenomExponent(parseInt(e.target.value, 10))}
                  label="Denom Exponent"
                />
                <Input
                  width="48%"
                  value={tempGasPrice}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => setGasPrice(e.target.value)}
                  label="Gas Price"
                />
              </div>
              <div className="settings-group">
                <Input
                  width="48%"
                  value={tempExplorerLink}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => setExplorerLink(e.target.value)}
                  label="Explorer Link (with '${txHash}' included)"
                />
              </div>
              <Button
                label="Set Chain"
                onClick={setChainFromForm}
              />
            </StackableContainer>
          </>
        ) : null}
        {showAuxView === 'confirmRedirect' && storedOption ? (
          <StackableContainer
            lessPadding
            lessMargin
            lessRadius
          >
            <p>
              If you change to {storedOption.label} your unsaved changes will be
              lost and you will be redirected to the main screen
            </p>
            <Button
              label={`Change to ${storedOption.label}`}
              onClick={redirectAndChangeChain}
            />
          </StackableContainer>
        ) : null}
      </StackableContainer>
      <style jsx>{`
        .chain-select-container {
          position: absolute;
          z-index: 10;
          top: 1em;
          right: 1em;
          width: ${showAuxView === 'settings' ? '600px' : '300px'};
        }
        .flex {
          margin-top: 0.5em;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .select-parent {
          width: calc(98% - 3em);
        }
        .settings-group {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5em;
        }
        button {
          background: none;
          border: none;
          display: block;
          width: 3em;
          height: 3em;
          opacity: 0.7;
          user-select: none;
        }
        button:hover {
          opacity: 1;
        }
        button.remove {
          background: rgba(255, 255, 255, 0.2);

          border-radius: 50%;
          border: none;
          color: white;
        }
        .error {
          color: coral;
          font-size: 0.8em;
          text-align: left;
          margin: 1em 0 0 0;
        }
      `}</style>
    </div>
  );
};

export default ChainSelect;
