import { MsgGetter } from "..";
import { MsgType } from "../../../../types/txMsg";
import MsgClaimRewardsForm from "./MsgClaimRewardsForm";
import MsgClearAdminForm from "./MsgClearAdmin";
import MsgDelegateForm from "./MsgDelegateForm";
import MsgExecuteContractForm from "./MsgExecuteContract";
import MsgInstantiateContractForm from "./MsgInstantiateContract";
import MsgMigrateContractForm from "./MsgMigrateContract";
import MsgRedelegateForm from "./MsgRedelegateForm";
import MsgSendForm from "./MsgSendForm";
import MsgSetWithdrawAddressForm from "./MsgSetWithdrawAddressForm";
import MsgUndelegateForm from "./MsgUndelegateForm";
import MsgUpdateAdminForm from "./MsgUpdateAdmin";

interface MsgFormProps {
  readonly msgType: MsgType;
  readonly senderAddress: string;
  readonly setMsgGetter: (msgGetter: MsgGetter) => void;
  readonly deleteMsg: () => void;
}

const MsgForm = ({ msgType, senderAddress, ...restProps }: MsgFormProps) => {
  switch (msgType) {
    case "send":
      return <MsgSendForm fromAddress={senderAddress} {...restProps} />;
    case "delegate":
      return <MsgDelegateForm delegatorAddress={senderAddress} {...restProps} />;
    case "undelegate":
      return <MsgUndelegateForm delegatorAddress={senderAddress} {...restProps} />;
    case "redelegate":
      return <MsgRedelegateForm delegatorAddress={senderAddress} {...restProps} />;
    case "claimRewards":
      return <MsgClaimRewardsForm delegatorAddress={senderAddress} {...restProps} />;
    case "setWithdrawAddress":
      return <MsgSetWithdrawAddressForm delegatorAddress={senderAddress} {...restProps} />;
    case "executeContract":
      return <MsgExecuteContractForm address={senderAddress} {...restProps} />;
    case "instantiateContract":
      return <MsgInstantiateContractForm address={senderAddress} {...restProps} />;
    case "migrateContract":
      return <MsgMigrateContractForm address={senderAddress} {...restProps} />;
    case "updateAdmin":
      return <MsgUpdateAdminForm address={senderAddress} {...restProps} />;
    case "clearAdmin":
      return <MsgClearAdminForm address={senderAddress} {...restProps} />;
    default:
      return null;
  }
};

export default MsgForm;
