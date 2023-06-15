import { EncodeObject } from "@cosmjs/proto-signing";
import {
  MsgType,
  TxMsg,
  TxMsgClaimRewards,
  TxMsgClearAdmin,
  TxMsgDelegate,
  TxMsgExecuteContract,
  TxMsgInstantiateContract,
  TxMsgMigrateContract,
  TxMsgRedelegate,
  TxMsgSend,
  TxMsgSetWithdrawAddress,
  TxMsgUndelegate,
  TxMsgUpdateAdmin,
} from "../types/txMsg";

const isTxMsgSend = (msg: TxMsg | EncodeObject): msg is TxMsgSend =>
  msg.typeUrl === "/cosmos.bank.v1beta1.MsgSend" &&
  "value" in msg &&
  "fromAddress" in msg.value &&
  "toAddress" in msg.value &&
  "amount" in msg.value &&
  !!msg.value.fromAddress &&
  !!msg.value.toAddress &&
  !!msg.value.amount.length;

const isTxMsgExecuteContract = (msg: TxMsg | EncodeObject): msg is TxMsgExecuteContract =>
  msg.typeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract";

const isTxMsgInstantiateContract = (msg: TxMsg | EncodeObject): msg is TxMsgInstantiateContract =>
  msg.typeUrl === "/cosmwasm.wasm.v1.MsgInstantiateContract";

const isTxMsgMigrateContract = (msg: TxMsg | EncodeObject): msg is TxMsgMigrateContract =>
  msg.typeUrl === "/cosmwasm.wasm.v1.MsgMigrateContract";

const isTxMsgUpdateAdmin = (msg: TxMsg | EncodeObject): msg is TxMsgUpdateAdmin =>
  msg.typeUrl === "/cosmwasm.wasm.v1.MsgUpdateAdmin";

const isTxMsgClearAdmin = (msg: TxMsg | EncodeObject): msg is TxMsgClearAdmin =>
  msg.typeUrl === "/cosmwasm.wasm.v1.MsgClearAdmin";

const isTxMsgDelegate = (msg: TxMsg | EncodeObject): msg is TxMsgDelegate =>
  msg.typeUrl === "/cosmos.staking.v1beta1.MsgDelegate" &&
  "value" in msg &&
  "delegatorAddress" in msg.value &&
  "validatorAddress" in msg.value &&
  "amount" in msg.value &&
  !!msg.value.delegatorAddress &&
  !!msg.value.validatorAddress &&
  !!msg.value.amount;

const isTxMsgUndelegate = (msg: TxMsg | EncodeObject): msg is TxMsgUndelegate =>
  msg.typeUrl === "/cosmos.staking.v1beta1.MsgUndelegate" &&
  "value" in msg &&
  "delegatorAddress" in msg.value &&
  "validatorAddress" in msg.value &&
  "amount" in msg.value &&
  !!msg.value.delegatorAddress &&
  !!msg.value.validatorAddress &&
  !!msg.value.amount;

const isTxMsgRedelegate = (msg: TxMsg | EncodeObject): msg is TxMsgRedelegate =>
  msg.typeUrl === "/cosmos.staking.v1beta1.MsgBeginRedelegate" &&
  "value" in msg &&
  "delegatorAddress" in msg.value &&
  "validatorSrcAddress" in msg.value &&
  "validatorDstAddress" in msg.value &&
  "amount" in msg.value &&
  !!msg.value.delegatorAddress &&
  !!msg.value.validatorSrcAddress &&
  !!msg.value.validatorDstAddress &&
  !!msg.value.amount;

const isTxMsgClaimRewards = (msg: TxMsg | EncodeObject): msg is TxMsgClaimRewards =>
  msg.typeUrl === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward" &&
  "value" in msg &&
  "delegatorAddress" in msg.value &&
  "validatorAddress" in msg.value &&
  !!msg.value.delegatorAddress &&
  !!msg.value.validatorAddress;

const isTxMsgSetWithdrawAddress = (msg: TxMsg | EncodeObject): msg is TxMsgSetWithdrawAddress =>
  msg.typeUrl === "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress" &&
  "value" in msg &&
  "delegatorAddress" in msg.value &&
  "withdrawAddress" in msg.value &&
  !!msg.value.delegatorAddress &&
  !!msg.value.withdrawAddress;

const gasOfMsg = (msgType: MsgType): number => {
  switch (msgType) {
    case "send":
      return 100_000;
    case "delegate":
      return 100_000;
    case "undelegate":
      return 100_000;
    case "redelegate":
      return 100_000;
    case "claimRewards":
      return 100_000;
    case "setWithdrawAddress":
      return 100_000;
    case "executeContract":
      return 1_000_000;
    case "instantiateContract":
      return 1_000_000;
    case "migrateContract":
      return 1_000_000;
    case "updateAdmin":
      return 100_000;
    case "clearAdmin":
      return 100_000;
    default:
      throw new Error("Unknown msg type");
  }
};

const gasOfTx = (msgTypes: readonly MsgType[]): number => {
  const txFlatGas = 100_000;
  const totalTxGas = msgTypes.reduce((acc, msgType) => acc + gasOfMsg(msgType), txFlatGas);
  return totalTxGas;
};

export {
  isTxMsgSend,
  isTxMsgDelegate,
  isTxMsgUndelegate,
  isTxMsgRedelegate,
  isTxMsgClaimRewards,
  isTxMsgSetWithdrawAddress,
  isTxMsgExecuteContract,
  isTxMsgInstantiateContract,
  isTxMsgMigrateContract,
  isTxMsgUpdateAdmin,
  isTxMsgClearAdmin,
  gasOfMsg,
  gasOfTx,
};
