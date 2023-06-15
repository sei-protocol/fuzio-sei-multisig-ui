import { fromUtf8 } from '@cosmjs/encoding';
import { useAppContext } from '../../../context/AppContext';
import { printableCoin } from '../../../lib/displayHelpers';
import { TxMsgExecuteContract } from '../../../types/txMsg';
import { useEffect, useState } from 'react';
import { JsonView, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

interface TxMsgExecuteContractDetailsProps {
  readonly msg: TxMsgExecuteContract;
}

const TxMsgExecuteContractDetails = ({
  msg,
}: TxMsgExecuteContractDetailsProps) => {
  const { state } = useAppContext();
  const [uint8, setUint8] = useState<Array<number>>([]);
  const [uint8Array, setUint8Array] = useState<Uint8Array>();
  const [executeMessage, setExecuteMessage] = useState<object | undefined>();

  // const test = fromUtf8(msg.value.msg);
  // console.log(test);

  // const test = new Uint8Array(msg.value.msg);

  useEffect(() => {
    const array: Array<number> = [];
    Object.values(msg.value.msg).map((entry) => {
      console.log(entry);
      array.push(entry as number);
    });
    setUint8(array);
  }, [msg]);

  useEffect(() => {
    if (uint8.length >= 1) {
      setUint8Array(new Uint8Array(uint8));
    }
  }, [uint8]);

  useEffect(() => {
    if (!uint8Array) {
      return;
    }
    setExecuteMessage(JSON.parse(fromUtf8(uint8Array)));
  }, [uint8Array]);

  return (
    <>
      <li>
        <h3>MsgExecuteContract</h3>
      </li>
      <li>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>Contract Address:</label>
        <div>{msg.value.contract}</div>
      </li>
      {msg.value.funds && (
        <li>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>Funds:</label>
          {msg.value.funds.map((fund) => {
            return (
              <div key={fund.amount + fund.denom}>
                {printableCoin(fund, state.chain)}
              </div>
            );
          })}
        </li>
      )}

      {executeMessage && (
        <li>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>Execute Message:</label>
          <JsonView
            data={executeMessage}
            shouldInitiallyExpand={(level) => true}
            style={darkStyles}
          />
        </li>
      )}

      <li>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>Sender:</label>
        <div title={msg.value.sender}>{msg.value.sender}</div>
      </li>
      <style jsx>{`
        li:not(:has(h3)) {
          background: rgba(255, 255, 255, 0.03);
          padding: 6px 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
        }
        li + li:nth-child(2) {
          margin-top: 25px;
        }
        li + li {
          margin-top: 10px;
        }
        li div {
          padding: 3px 6px;
        }
        label {
          font-size: 12px;
          background: rgba(255, 255, 255, 0.1);
          padding: 3px 6px;
          border-radius: 5px;
          display: block;
        }
      `}</style>
    </>
  );
};

export default TxMsgExecuteContractDetails;
