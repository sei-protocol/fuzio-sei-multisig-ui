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

interface MsgUpdateAdminFormProps {
  readonly address: string;
  readonly setMsgGetter: (msgGetter: MsgGetter) => void;
  readonly deleteMsg: () => void;
}

const MsgUpdateAdminForm = ({
  address,
  setMsgGetter,
  deleteMsg,
}: MsgUpdateAdminFormProps) => {
  const { state } = useAppContext();
  assert('sei', 'addressPrefix missing');

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
        assert('sei', 'addressPrefix missing');

        // const addressErrorMsg = checkAddress(validatorAddress, 'sei');
        // if (addressErrorMsg) {
        //   setValidatorAddressError(
        //     `Invalid address for network ${'sei'}: ${addressErrorMsg}`,
        //   );
        //   return false;
        // }

        // if (!amount || Number(amount) <= 0) {
        //   setAmountError("Amount must be greater than 0");
        //   return false;
        // }

        return isTxMsgUpdateAdmin(msg);
      };

      const msg: TxMsgUpdateAdmin = {
        typeUrl: '/cosmwasm.wasm.v1.MsgUpdateAdmin',
        value: {
          contract: contractAddress,
          funds: [{ amount: '1000', denom: 'usei' }],
          newAdmin: newAdmin,
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
    'sei',
    'sei',
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
      <h2>MsgUpdateAdminContract</h2>
      <div className="form-item">
        <Input
          label="Contract Address"
          type="text"
          name="contract-address"
          value={contractAddress}
          onChange={({ target }) => setContractAddress(target.value)}
          error={validatorAddressError}
          placeholder={`E.g. ${exampleAddress(0, 'sei')}`}
        />
      </div>
      <div className="form-item">
        <Input
          label="New Admin Address"
          type="text"
          name="admin-address"
          value={newAdmin}
          onChange={({ target }) => setNewAdmin(target.value)}
          error={validatorAddressError}
          placeholder={`E.g. ${exampleAddress(0, 'sei')}`}
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

export default MsgUpdateAdminForm;
