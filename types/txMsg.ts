export type MsgType =
  | "send"
  | "delegate"
  | "undelegate"
  | "redelegate"
  | "claimRewards"
  | "setWithdrawAddress"
  | "executeContract"
  | "instantiateContract"
  | "migrateContract"
  | "updateAdmin"
  | "clearAdmin";

export type TxMsg =
  | TxMsgSend
  | TxMsgDelegate
  | TxMsgUndelegate
  | TxMsgRedelegate
  | TxMsgClaimRewards
  | TxMsgSetWithdrawAddress
  | TxMsgExecuteContract
  | TxMsgInstantiateContract
  | TxMsgUpdateAdmin
  | TxMsgClearAdmin
  | TxMsgMigrateContract;

export interface TxMsgExecuteContract {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract";
  readonly value: {
    readonly contract: string;
    readonly sender: string;
    readonly msg: Uint8Array;
    readonly funds?: [{ readonly amount: string; readonly denom: string }];
  };
}

export interface TxMsgInstantiateContract {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract";
  readonly value: {
    readonly sender: string;
    readonly codeId: number;
    readonly label: string;
    readonly msg: Uint8Array;
    readonly funds?: [{ readonly amount: string; readonly denom: string }];
    readonly admin: string;
  };
}

export interface TxMsgUpdateAdmin {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin";
  readonly value: {
    sender: string;
    contract: string;
    newAdmin: string;
    readonly funds?: [{ readonly amount: string; readonly denom: string }];
  };
}

export interface TxMsgClearAdmin {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin";
  readonly value: {
    sender: string;
    contract: string;
    readonly funds?: [{ readonly amount: string; readonly denom: string }];
  };
}

export interface TxMsgMigrateContract {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract";
  readonly value: {
    sender: string;
    contract: string;
    codeId: number;
    msg: Uint8Array;
    readonly funds?: [{ readonly amount: string; readonly denom: string }];
  };
}

export interface TxMsgSend {
  readonly typeUrl: "/cosmos.bank.v1beta1.MsgSend";
  readonly value: {
    readonly fromAddress: string;
    readonly toAddress: string;
    readonly amount: [{ readonly amount: string; readonly denom: string }];
  };
}

export interface TxMsgDelegate {
  readonly typeUrl: "/cosmos.staking.v1beta1.MsgDelegate";
  readonly value: {
    readonly delegatorAddress: string;
    readonly validatorAddress: string;
    readonly amount: { readonly amount: string; readonly denom: string };
  };
}

export interface TxMsgUndelegate {
  readonly typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate";
  readonly value: {
    readonly delegatorAddress: string;
    readonly validatorAddress: string;
    readonly amount: { readonly amount: string; readonly denom: string };
  };
}

export interface TxMsgRedelegate {
  readonly typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate";
  readonly value: {
    readonly delegatorAddress: string;
    readonly validatorSrcAddress: string;
    readonly validatorDstAddress: string;
    readonly amount: { readonly amount: string; readonly denom: string };
  };
}

export interface TxMsgClaimRewards {
  readonly typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
  readonly value: {
    readonly delegatorAddress: string;
    readonly validatorAddress: string;
  };
}

export interface TxMsgSetWithdrawAddress {
  readonly typeUrl: "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress";
  readonly value: {
    readonly delegatorAddress: string;
    readonly withdrawAddress: string;
  };
}
