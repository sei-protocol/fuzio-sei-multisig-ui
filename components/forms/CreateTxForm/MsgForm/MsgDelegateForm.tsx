import { Decimal } from '@cosmjs/math';
import { assert } from '@cosmjs/utils';
import { useEffect, useState } from 'react';
import { MsgGetter } from '..';
import { useAppContext } from '../../../../context/AppContext';
import { checkAddress, exampleAddress } from '../../../../lib/displayHelpers';
import { isTxMsgDelegate } from '../../../../lib/txMsgHelpers';
import { TxMsg, TxMsgDelegate } from '../../../../types/txMsg';
import Input from '../../../inputs/Input';
import StackableContainer from '../../../layout/StackableContainer';

interface MsgDelegateFormProps {
  readonly delegatorAddress: string;
  readonly setMsgGetter: (msgGetter: MsgGetter) => void;
  readonly deleteMsg: () => void;
}

const MsgDelegateForm = ({
  delegatorAddress,
  setMsgGetter,
  deleteMsg,
}: MsgDelegateFormProps) => {
  const { state } = useAppContext();
  assert('sei', 'addressPrefix missing');

  const [validatorAddress, setValidatorAddress] = useState('');
  const [amount, setAmount] = useState('0');

  const [validatorAddressError, setValidatorAddressError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    try {
      assert(state.chain.denom, 'denom missing');

      setValidatorAddressError('');
      setAmountError('');

      const isMsgValid = (msg: TxMsg): msg is TxMsgDelegate => {
        assert('sei', 'addressPrefix missing');

        const addressErrorMsg = checkAddress(
          validatorAddress,
          'sei',
        );
        if (addressErrorMsg) {
          setValidatorAddressError(
            `Invalid address for network ${'sei'}: ${addressErrorMsg}`,
          );
          return false;
        }

        if (!amount || Number(amount) <= 0) {
          setAmountError('Amount must be greater than 0');
          return false;
        }

        return isTxMsgDelegate(msg);
      };

      const amountInAtomics = Decimal.fromUserInput(
        amount || '0',
        Number(state.chain.displayDenomExponent),
      ).atomics;

      const msg: TxMsgDelegate = {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: {
          amount: { amount: amountInAtomics, denom: state.chain.denom },
          delegatorAddress,
          validatorAddress,
        },
      };

      setMsgGetter({ isMsgValid, msg });
    } catch {}
  }, [
    amount,
    delegatorAddress,
    setMsgGetter,
    'sei',
    'sei',
    state.chain.denom,
    state.chain.displayDenomExponent,
    validatorAddress,
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
      <h2>MsgDelegate</h2>
      <div className="form-item">
        <Input
          label="Validator Address"
          name="validator-address"
          value={validatorAddress}
          onChange={({ target }) => setValidatorAddress(target.value)}
          error={validatorAddressError}
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

export default MsgDelegateForm;
