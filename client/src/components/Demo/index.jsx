import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Contract from "./Contract";
import FormTicket from "../FormTicket";
import FormTicket from "../FormTicket";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const { state: { artifact, contract } } = useEth();
  const [value, setValue] = useState("?");

  const demo =
    <>
      <div className="contract-container">
        <FormTicket />
        <Contract value={value} />

      </div>
    </>;

  return (
    <div className="demo">
      <Title />
      {
        !artifact ? <NoticeNoArtifact /> :
          !contract ? <NoticeWrongNetwork /> :
            demo
      }
    </div>
  );
}

export default Demo;
