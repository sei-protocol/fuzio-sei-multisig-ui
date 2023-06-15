import { Decimal } from '@cosmjs/math';
import { assert } from '@cosmjs/utils';
import { useEffect, useState } from 'react';
import { MsgGetter } from '..';
import { useAppContext } from '../../../../context/AppContext';
import { exampleAddress } from '../../../../lib/displayHelpers';
import { isTxMsgInstantiateContract } from '../../../../lib/txMsgHelpers';
import { TxMsg, TxMsgInstantiateContract } from '../../../../types/txMsg';
import Input from '../../../inputs/Input';
import StackableContainer from '../../../layout/StackableContainer';
import { toUtf8 } from '@cosmjs/encoding';
import Long from 'long';
import { Coin } from '@cosmjs/amino';
import {
  convertMicroDenomToDenom,
  convertDenomToMicroDenom,
} from '../../../../lib/helpers';

interface MsgInstantiateContractFormProps {
  readonly address: string;
  readonly setMsgGetter: (msgGetter: MsgGetter) => void;
  readonly deleteMsg: () => void;
}

const MsgInstantiateContractForm = ({
  address,
  setMsgGetter,
  deleteMsg,
}: MsgInstantiateContractFormProps) => {
  const { state } = useAppContext();
  assert(state.chain.addressPrefix, 'addressPrefix missing');

  const [adminAddress, setAdminAddress] = useState(address);
  const [label, setLabel] = useState(``);
  const [codeId, setCodeId] = useState(Long.fromString('0'));
  const [instantiateMessage, setInstantiateMessage] = useState(`{}`);
  const [funds, setFunds] = useState<Coin>({ amount: '100000', denom: 'usei' });

  const [validatorAddressError, setValidatorAddressError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    try {
      assert(state.chain.denom, 'denom missing');

      setValidatorAddressError('');
      setAmountError('');

      const isMsgValid = (msg: TxMsg): msg is TxMsgInstantiateContract => {
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

        return isTxMsgInstantiateContract(msg);
      };

      const amountInAtomics = Decimal.fromUserInput(
        '0',
        Number(state.chain.displayDenomExponent),
      ).atomics;

      console.log(instantiateMessage);

      const test = toUtf8(instantiateMessage);
      const msg: TxMsgInstantiateContract = {
        typeUrl: '/cosmwasm.wasm.v1.MsgInstantiateContract',
        value: {
          admin: address,
          codeId: codeId.low,
          funds: [funds],
          label,
          msg: test,
          sender: address,
        },
      };

      console.log(msg);

      setMsgGetter({ isMsgValid, msg });
    } catch {}
  }, [
    address,
    codeId,
    label,
    funds,
    adminAddress,
    instantiateMessage,
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
      <h2>MsgInstantiateContract</h2>
      <div className="form-item">
        <Input
          label="Admin Address"
          type="text"
          name="admin-address"
          value={adminAddress}
          onChange={({ target }) => setAdminAddress(target.value)}
          error={validatorAddressError}
          placeholder={`E.g. ${exampleAddress(0, state.chain.addressPrefix)}`}
        />
      </div>
      <div className="form-item">
        <Input
          label="Label"
          type="text"
          name="label"
          value={label}
          onChange={({ target }) => setLabel(target.value)}
          error={validatorAddressError}
          placeholder={`E.g. "Fuzio Inu"`}
        />
      </div>
      <div className="form-item">
        <Input
          label="Code ID"
          type="text"
          name="codeId"
          value={codeId.toString()}
          onChange={({ target }) => setCodeId(Long.fromString(target.value))}
          error={validatorAddressError}
          placeholder={`E.g. "101"`}
        />
      </div>
      <div className="form-item">
        <Input
          type="textarea"
          label={`Instantiate Message`}
          name="instantiateMessage"
          value={instantiateMessage}
          onChange={({ target }) => setInstantiateMessage(target.value)}
          error={amountError}
        />
      </div>
      <div
        className="form-item"
        style={{ display: 'flex', width: '100%' }}
      >
        <Input
          label="Funds"
          type="number"
          name="funds"
          value={convertMicroDenomToDenom(funds.amount, 6).toString()}
          onChange={({ target }) =>
            setFunds((prev) => {
              return {
                ...prev,
                amount: convertDenomToMicroDenom(target.value, 6)
                  .ceil()
                  .toString(),
              };
            })
          }
          error={validatorAddressError}
          placeholder={`E.g. ${exampleAddress(0, state.chain.addressPrefix)}`}
        />
        <select
          onChange={({ target }) =>
            setFunds((prev) => {
              return {
                ...prev,
                denom: target.value,
              };
            })
          }
        >
          <option value="usei">Sei</option>
          <option value="factory/sei1nsfrq4m5rnwtq5f0awkzr6u9wpsycctjlgzr9q/ZIO">
            Fuzio
          </option>
        </select>
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

export default MsgInstantiateContractForm;
