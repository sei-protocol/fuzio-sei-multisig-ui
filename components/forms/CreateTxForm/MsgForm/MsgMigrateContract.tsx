import { assert } from '@cosmjs/utils';
import { useEffect, useState } from 'react';
import { MsgGetter } from '..';
import { useAppContext } from '../../../../context/AppContext';
import { exampleAddress } from '../../../../lib/displayHelpers';
import { isTxMsgMigrateContract } from '../../../../lib/txMsgHelpers';
import { TxMsg, TxMsgMigrateContract } from '../../../../types/txMsg';
import Input from '../../../inputs/Input';
import StackableContainer from '../../../layout/StackableContainer';
import { toUtf8 } from '@cosmjs/encoding';
import Long from 'long';

interface MsgMigrateContractFormProps {
  readonly address: string;
  readonly setMsgGetter: (msgGetter: MsgGetter) => void;
  readonly deleteMsg: () => void;
}

const MsgMigrateContractForm = ({
  address,
  setMsgGetter,
  deleteMsg,
}: MsgMigrateContractFormProps) => {
  const { state } = useAppContext();
  assert('sei', 'addressPrefix missing');

  const [contractAddress, setContractAddress] = useState('');
  const [migrateMessage, setMigrateMessage] = useState(`{}`);
  const [codeId, setCodeId] = useState(Long.fromString('0'));

  const [validatorAddressError, setValidatorAddressError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    try {
      assert(state.chain.denom, 'denom missing');

      setValidatorAddressError('');
      setAmountError('');

      const isMsgValid = (msg: TxMsg): msg is TxMsgMigrateContract => {
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

        return isTxMsgMigrateContract(msg);
      };

      const test = toUtf8(migrateMessage);
      const msg: TxMsgMigrateContract = {
        typeUrl: '/cosmwasm.wasm.v1.MsgMigrateContract',
        value: {
          codeId: codeId.low,
          contract: contractAddress,
          funds: [{ amount: '1000', denom: 'usei' }],
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
    contractAddress,
    migrateMessage,
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
      <h2>MsgMigrateContract</h2>
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
          label="New Code ID"
          type="text"
          name="code-id"
          value={codeId.low}
          onChange={({ target }) => setCodeId(Long.fromString(target.value))}
          error={validatorAddressError}
          placeholder={`E.g. ${exampleAddress(0, 'sei')}`}
        />
      </div>
      <div className="form-item">
        <Input
          type="textarea"
          label={`Migrate Message`}
          name="migrateMessage"
          value={migrateMessage}
          onChange={({ target }) => setMigrateMessage(target.value)}
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

export default MsgMigrateContractForm;
