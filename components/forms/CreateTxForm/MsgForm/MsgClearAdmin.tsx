import { Decimal } from '@cosmjs/math';
import { assert } from '@cosmjs/utils';
import { useEffect, useState } from 'react';
import { MsgGetter } from '..';
import { useAppContext } from '../../../../context/AppContext';
import { exampleAddress } from '../../../../lib/displayHelpers';
import {
  isTxMsgExecuteContract,
  isTxMsgInstantiateContract,
  isTxMsgMigrateContract,
  isTxMsgUpdateAdmin,
} from '../../../../lib/txMsgHelpers';
import {
  TxMsg,
  TxMsgClearAdmin,
  TxMsgDelegate,
  TxMsgExecuteContract,
  TxMsgInstantiateContract,
  TxMsgMigrateContract,
  TxMsgUpdateAdmin,
} from '../../../../types/txMsg';
import Input from '../../../inputs/Input';
import StackableContainer from '../../../layout/StackableContainer';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { fromUtf8, toUtf8 } from '@cosmjs/encoding';
import Long from 'long';

interface MsgClearAdminFormProps {
  readonly address: string;
  readonly setMsgGetter: (msgGetter: MsgGetter) => void;
  readonly deleteMsg: () => void;
}

const MsgClearAdminForm = ({
  address,
  setMsgGetter,
  deleteMsg,
}: MsgClearAdminFormProps) => {
  const { state } = useAppContext();
  assert(state.chain.addressPrefix, 'addressPrefix missing');

  const [contractAddress, setContractAddress] = useState('');
  const [newAdmin, setNewAdmin] = useState('');

  const [validatorAddressError, setValidatorAddressError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    try {
      assert(state.chain.denom, 'denom missing');

      setValidatorAddressError('');
      setAmountError('');

      const isMsgValid = (msg: TxMsg): msg is TxMsgUpdateAdmin => {
        assert(state.chain.addressPrefix, 'addressPrefix missing');

        // const addressErrorMsg = checkAddress(validatorAddress, state.chain.addressPrefix);
        // if (addressErrorMsg) {
        //   setValidatorAddressError(
        //     `Invalid address for network ${state.chain.chainId}: ${addressErrorMsg}`,
        //   );
        //   return false;
        // }

        // if (!amount || Number(amount) <= 0) {
        //   setAmountError("Amount must be greater than 0");
        //   return false;
        // }

        return isTxMsgUpdateAdmin(msg);
      };

      const msg: TxMsgClearAdmin = {
        typeUrl: '/cosmwasm.wasm.v1.MsgClearAdmin',
        value: {
          contract: contractAddress,
          funds: [{ amount: '1000', denom: 'usei' }],
          sender: address,
        },
      };

      console.log(msg);

      setMsgGetter({ isMsgValid, msg });
    } catch {}
  }, [
    address,
    newAdmin,
    contractAddress,
    setMsgGetter,
    state.chain.addressPrefix,
    state.chain.chainId,
    state.chain.denom,
    state.chain.displayDenomExponent,
  ]);

  return (
    <StackableContainer
      lessPadding
      lessMargin
    >
      <button
        className="remove"
        onClick={() => deleteMsg()}
      >
        ✕
      </button>
      <h2>MsgClearAdminContract</h2>
      <div className="form-item">
        <Input
          label="Contract Address"
          type="text"
          name="contract-address"
          value={contractAddress}
          onChange={({ target }) => setContractAddress(target.value)}
          error={validatorAddressError}
          placeholder={`E.g. ${exampleAddress(0, state.chain.addressPrefix)}`}
        />
      </div>
      <style jsx>{`
        .form-item {
          margin-top: 1.5em;
        }
        button.remove {
          background: rgba(255, 255, 255, 0.2);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          color: white;
          position: absolute;
          right: 10px;
          top: 10px;
        }
      `}</style>
    </StackableContainer>
  );
};

export default MsgClearAdminForm;
