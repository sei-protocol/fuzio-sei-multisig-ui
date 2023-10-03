import { MultisigThresholdPubkey, SinglePubkey } from '@cosmjs/amino';
import { Account, StargateClient } from '@cosmjs/stargate';
import { assert } from '@cosmjs/utils';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import HashView from '../../../components/dataViews/HashView';
import MultisigHoldings from '../../../components/dataViews/MultisigHoldings';
import MultisigMembers from '../../../components/dataViews/MultisigMembers';
import CreateTxForm from '../../../components/forms/CreateTxForm';
import Button from '../../../components/inputs/Button';
import Page from '../../../components/layout/Page';
import StackableContainer from '../../../components/layout/StackableContainer';
import { useAppContext } from '../../../context/AppContext';
import { explorerLinkAccount } from '../../../lib/displayHelpers';
import { getMultisigAccount } from '../../../lib/multisigHelpers';

function participantPubkeysFromMultisig(
  multisig: MultisigThresholdPubkey,
): readonly SinglePubkey[] {
  return multisig.value.pubkeys;
}

const Multipage = () => {
  const router = useRouter();
  const { state } = useAppContext();
  assert('sei', 'address prefix missing');

  const [holdings, setHoldings] = useState<readonly Coin[]>([]);
  const [accountOnChain, setAccountOnChain] = useState<Account | null>(null);
  const [pubkey, setPubkey] = useState<MultisigThresholdPubkey>();
  const [accountError, setAccountError] = useState(null);

  const multisigAddress = router.query.address?.toString();
  const explorerHref = explorerLinkAccount(
    process.env.NEXT_PUBLIC_EXPLORER_LINK_ACCOUNT || '',
    multisigAddress || '',
  );

  const fetchMultisig = useCallback(
    async (address: string) => {
      setAccountError(null);
      try {
        assert('https://sei-rpc.polkachu.com/', 'Node address missing');
        const client = await StargateClient.connect('https://sei-rpc.polkachu.com/');
        assert(state.chain.denom, 'denom missing');
        const tempHoldings = await client.getAllBalances(address);
        setHoldings(tempHoldings);
        assert('sei', 'addressPrefix missing');
        const [newPubkey, newAccountOnChain] = await getMultisigAccount(
          address,
          'sei',
          client,
        );
        setPubkey(newPubkey);
        setAccountOnChain(newAccountOnChain);
      } catch (error: any) {
        setAccountError(error.message);
        console.log('Account error:', error);
      }
    },
    ['sei', state.chain.denom, 'https://sei-rpc.polkachu.com/'],
  );

  useEffect(() => {
    if (multisigAddress) {
      fetchMultisig(multisigAddress);
    }
  }, [fetchMultisig, multisigAddress]);

  return (
    <Page goBack={{ needsConfirm: true, pathname: '/', title: 'home' }}>
      <StackableContainer base>
        <StackableContainer>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>Multisig Address</label>
          <h1>
            {multisigAddress ? (
              <HashView hash={multisigAddress} />
            ) : (
              'No Address'
            )}
          </h1>
          {explorerHref ? (
            <Button
              href={explorerHref}
              label="View in Explorer"
            ></Button>
          ) : null}
        </StackableContainer>
        {pubkey ? (
          <MultisigMembers
            members={participantPubkeysFromMultisig(pubkey)}
            addressPrefix={'sei'}
            threshold={pubkey.value.threshold}
          />
        ) : null}
        <div className="interfaces">
          <div className="col-1">
            <MultisigHoldings holdings={holdings} />
          </div>
          <div className="col-2">
            <StackableContainer lessPadding>
              <h2>New transaction</h2>
              <p>
                Once a transaction is created, it can be signed by the multisig
                members, and then broadcast.
              </p>
            </StackableContainer>
          </div>
        </div>
        {accountError || !accountOnChain ? (
          <StackableContainer>
            <div className="multisig-error">
              {accountError ? (
                <>
                  <p>
                    This multisig address's pubkeys are not available, and so it
                    cannot be used with this tool.
                  </p>
                  <p>
                    You can recreate it with this tool here, or sign and
                    broadcast a transaction with the tool you used to create it.
                    Either option will make the pubkeys accessible and will
                    allow this tool to use this multisig fully.
                  </p>
                </>
              ) : null}
              {!!accountOnChain ? (
                <p>
                  An account needs to be present on chain before creating a
                  transaction. Send some tokens to the address first.
                </p>
              ) : null}
            </div>
          </StackableContainer>
        ) : null}
        {accountOnChain && multisigAddress ? (
          <CreateTxForm
            senderAddress={multisigAddress}
            accountOnChain={accountOnChain}
          />
        ) : null}
      </StackableContainer>
      <style jsx>{`
        .interfaces {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
          flex-direction: column;
        }
        .col-1 {
          flex: 1;
          padding-right: 0;
          margin-bottom: 50px;
        }
        .col-2 {
          flex: 1;
        }
        label {
          font-size: 12px;
          font-style: italic;
        }
        p {
          margin-top: 15px;
          max-width: 100%;
        }
        .multisig-error p {
          max-width: 550px;
          color: red;
          font-size: 16px;
          line-height: 1.4;
        }
        .multisig-error p:first-child {
          margin-top: 0;
        }
      `}</style>
    </Page>
  );
};

export default Multipage;
