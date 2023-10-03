import { Decimal } from '@cosmjs/math';
import { assert } from '@cosmjs/utils';
import { useEffect, useState } from 'react';
import { MsgGetter } from '..';
import { useAppContext } from '../../../../context/AppContext';
import { exampleAddress } from '../../../../lib/displayHelpers';
import { isTxMsgExecuteContract } from '../../../../lib/txMsgHelpers';
import { TxMsg, TxMsgExecuteContract } from '../../../../types/txMsg';
import Input from '../../../inputs/Input';
import StackableContainer from '../../../layout/StackableContainer';
import { toUtf8 } from '@cosmjs/encoding';
import { Coin } from '@cosmjs/amino';
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from '../../../../lib/helpers';

interface MsgExecuteContractFormProps {
  readonly address: string;
  readonly setMsgGetter: (msgGetter: MsgGetter) => void;
  readonly deleteMsg: () => void;
}

const MsgExecuteContractForm = ({
  address,
  setMsgGetter,
  deleteMsg,
}: MsgExecuteContractFormProps) => {
  const { state } = useAppContext();
  assert('sei', 'addressPrefix missing');

  const [contractAddress, setContractAddress] = useState(
    'sei14n07r30dhcxnym2p2mahcd9my2nqfeq55a0jwdpph59cgumhhj4smp4974',
  );
  const [funds, setFunds] = useState<Coin>({ amount: '100000', denom: 'usei' });
  const [executeMessage, setExecuteMessage] = useState(`{"swap":{}}`);

  const [validatorAddressError, setValidatorAddressError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    try {
      assert(state.chain.denom, 'denom missing');

      setValidatorAddressError('');
      setAmountError('');

      const isMsgValid = (msg: TxMsg): msg is TxMsgExecuteContract => {
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

        return isTxMsgExecuteContract(msg);
      };

      const test = toUtf8(executeMessage);
      const msg: TxMsgExecuteContract = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: {
          contract: contractAddress,
          funds: [funds],
          msg: test,
          sender: address,
        },
      };

      console.log(msg);

      setMsgGetter({ isMsgValid, msg });
    } catch {}
  }, [
    address,
    contractAddress,
    executeMessage,
    funds,
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
      <h2>MsgExecuteContract</h2>
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
          type="textarea"
          label={`Execute Message`}
          name="executeMessage"
          value={executeMessage}
          onChange={({ target }) => setExecuteMessage(target.value)}
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
          placeholder={`E.g. ${exampleAddress(0, 'sei')}`}
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

export default MsgExecuteContractForm;
