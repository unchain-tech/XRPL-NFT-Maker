import { Button } from '@mui/material';
import { extractAffectedNFT } from '@xrplkit/txmeta';
import { Buffer } from 'buffer';
import { NFTStorage } from 'nft.storage';
import { useEffect, useState } from 'react';
import { XrplClient } from 'xrpl-client';
import { Xumm } from 'xumm';

import './index.css';

// Xumm Developer Console](https://apps.xumm.dev)で取得したAPIキーを設定します。
const xumm = new Xumm('api-key');
// [NFT.Storage](https://nft.storage)で取得したAPIキーを設定します。
const nftStorage = new NFTStorage({ token: 'nft-storage-key' });

export const NftMinter = () => {
  const [account, setAccount] = useState(undefined);
  const [file, setFile] = useState(undefined);

  useEffect(() => {
    // Xummとの連携が成功時に`success`イベントが発生するので、それを検知してアカウント情報を取得します。
    xumm.on('success', async () => {
      setAccount(await xumm.user.account);
    });
  }, []);

  // Xummと接続するための`connect`関数を定義します。
  const connect = () => {
    xumm.authorize();
  };

  const uploadImage = (e) => {
    const files = e.target.files;
    setFile(files[0]);
  };

  const mint = async () => {
    if (!file) {
      alert('画像ファイルを選択してください');
      return;
    }

    // 画像とメタデータをIPFSにアップロードします。
    const { url } = await nftStorage.store({
      schema: 'ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU',
      nftType: 'art.v0',
      image: file,
      name: 'My NFT',
      description: 'My NFT description',
    });

    // Xummにトランザクションデータを送信します。
    const payload = await xumm.payload.createAndSubscribe({
      TransactionType: 'NFTokenMint',
      NFTokenTaxon: 0,
      Flags: 8, // tfTransferableフラグ（8）は第三者間での売買が可能になります。
      URI: Buffer.from(url).toString('hex'),
    });
    payload.websocket.onmessage = (msg) => {
      const data = JSON.parse(msg.data.toString());
      // トランザクションへの署名が完了/拒否されたらresolveします。
      if (typeof data.signed === 'boolean') {
        payload.resolve({ signed: data.signed, txid: data.txid });
      }
    };
    // resolveされるまで待機します。
    const { signed, txid } = await payload.resolved;
    if (!signed) {
      alert('トランザクションへの署名は拒否されました!');
      return;
    }
    // Xummから署名されたトランザクションの情報を取得します。
    const client = new XrplClient('wss://testnet.xrpl-labs.com');
    const txResponse = await client.send({
      command: 'tx',
      transaction: txid,
    });
    // トランザクション情報からNFTの情報を取得します。
    const nftoken = extractAffectedNFT(txResponse);
    alert('NFTトークンが発行されました!');
    window.open(`https://test.bithomp.com/nft/${nftoken.NFTokenID}`, '_blank');
  };

  return (
    <div className="nft-minter-box">
      <div className="title">XRP NFT</div>
      <div className="account-box">
        <div className="account">{account}</div>
        <Button variant="contained" onClick={connect}>
          connect
        </Button>
      </div>
      <div className="image-box">
        <Button variant="contained" onChange={uploadImage}>
          ファイルを選択
          <input
            className="imageInput"
            type="file"
            accept=".jpg , .jpeg , .png"
          />
        </Button>
      </div>
      {/* 選択された画像を表示します */}
      {file && (
        <img
          src={window.URL.createObjectURL(file)}
          alt="nft"
          className="nft-image"
        />
      )}
      {account && (
        <div>
          <Button variant="outlined" onClick={mint}>
            mint
          </Button>
        </div>
      )}
    </div>
  );
};
