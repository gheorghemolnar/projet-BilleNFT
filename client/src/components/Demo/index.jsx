import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Contract from "./Contract";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const { state: { artifact, contract, wallet = [], baseURI } } = useEth();
  const [value, setValue] = useState("?");

  const demo =
    <>
      <div className="contract-container">
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
