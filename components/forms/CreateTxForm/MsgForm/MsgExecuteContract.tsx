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
  assert(state.chain.addressPrefix, 'addressPrefix missing');

  const [contractAddress, setContractAddress] = useState(
    'sei14n07r30dhcxnym2p2mahcd9my2nqfeq55a0jwdpph59cgumhhj4smp4974',
  );
  const [executeMessage, setExecuteMessage] = useState(`{"swap":{}}`);

  const [validatorAddressError, setValidatorAddressError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    try {
      assert(state.chain.denom, 'denom missing');

      setValidatorAddressError('');
      setAmountError('');

      const isMsgValid = (msg: TxMsg): msg is TxMsgExecuteContract => {
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

        return isTxMsgExecuteContract(msg);
      };

      const amountInAtomics = Decimal.fromUserInput(
        '0',
        Number(state.chain.displayDenomExponent),
      ).atomics;

      const test = toUtf8(executeMessage);
      const msg: TxMsgExecuteContract = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: {
          contract: contractAddress,
          funds: [{ amount: '10000', denom: 'usei' }],
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
      <h2>MsgExecuteContract</h2>
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
