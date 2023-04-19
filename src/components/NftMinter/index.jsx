import { Button } from "@mui/material";
import { Xumm } from "xumm";
import "./index.css";

// const xumm = new Xumm('api-key')

export const NftMinter = () => {
  return (
    <div className="nft-minter-box">
      <div className="title">XRP NFT</div>
      <div className="image-box">
        <Button variant="contained">
          ファイルを選択
          <input
            className="imageInput"
            type="file"
            accept=".jpg , .jpeg , .png"
          />
        </Button>
      </div>
    </div>
  );
}
