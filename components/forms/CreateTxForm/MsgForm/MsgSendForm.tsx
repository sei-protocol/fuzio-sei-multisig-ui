import { Decimal } from '@cosmjs/math';
import { assert } from '@cosmjs/utils';
import { useEffect, useState } from 'react';
import { MsgGetter } from '..';
import { useAppContext } from '../../../../context/AppContext';
import { checkAddress, exampleAddress } from '../../../../lib/displayHelpers';
import { isTxMsgSend } from '../../../../lib/txMsgHelpers';
import { TxMsg, TxMsgSend } from '../../../../types/txMsg';
import Input from '../../../inputs/Input';
import StackableContainer from '../../../layout/StackableContainer';

interface MsgSendFormProps {
  readonly fromAddress: string;
  readonly setMsgGetter: (msgGetter: MsgGetter) => void;
  readonly deleteMsg: () => void;
}

const MsgSendForm = ({
  fromAddress,
  setMsgGetter,
  deleteMsg,
}: MsgSendFormProps) => {
  const { state } = useAppContext();
  assert('sei', 'addressPrefix missing');

  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('0');

  const [toAddressError, setToAddressError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    try {
      assert(state.chain.denom, 'denom missing');

      setToAddressError('');
      setAmountError('');

      const isMsgValid = (msg: TxMsg): msg is TxMsgSend => {
        assert('sei', 'addressPrefix missing');

        const addressErrorMsg = checkAddress(
          toAddress,
          'sei',
        );
        if (addressErrorMsg) {
          setToAddressError(
            `Invalid address for network ${'sei'}: ${addressErrorMsg}`,
          );
          return false;
        }

        if (!amount || Number(amount) <= 0) {
          setAmountError('Amount must be greater than 0');
          return false;
        }

        return isTxMsgSend(msg);
      };

      const amountInAtomics = amount
        ? Decimal.fromUserInput(
            amount,
            Number(state.chain.displayDenomExponent),
          ).atomics
        : '0';

      const msg: TxMsgSend = {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          amount: [{ amount: amountInAtomics, denom: state.chain.denom }],
          fromAddress,
          toAddress,
        },
      };

      setMsgGetter({ isMsgValid, msg });
    } catch {}
  }, [
    amount,
    fromAddress,
    setMsgGetter,
    'sei',
    'sei',
    state.chain.denom,
    state.chain.displayDenomExponent,
    toAddress,
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
      <h2>MsgSend</h2>
      <div className="form-item">
        <Input
          label="Recipient Address"
          name="recipient-address"
          value={toAddress}
          onChange={({ target }) => setToAddress(target.value)}
          error={toAddressError}
          placeholder={`E.g. ${exampleAddress(0, 'sei')}`}
        />
      </div>
      <div className="form-item">
        <Input
          type="number"
          label={`Amount (${state.chain.displayDenom})`}
          name="amount"
          value={amount}
          onChange={({ target }) => setAmount(target.value)}
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

export default MsgSendForm;
