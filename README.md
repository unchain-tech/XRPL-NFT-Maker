# XRPL NFT Maker

## 実行方法

### 1. 本リポジトリのクローン

```bash
git clone -b complete git@github.com:unchain-tech/XRPL-NFT-Maker.git
```

### 2. パッケージのインストール

```bash
npm install
```

### 3. API キーの設定

`src/components/NftMinter/index.jsx`内の下記の部分に、API キーを設定します。

```javascript
// Xumm Developer Console](https://apps.xumm.dev)で取得したAPIキーを設定します。
const xumm = new Xumm('api-key');
// [NFT.Storage](https://nft.storage)で取得したAPIキーを設定します。
const nftStorage = new NFTStorage({ token: 'nft-storage-key' });
```

### 4. 開発サーバーの起動

```bash
npm start
```

ターミナル上に表示された URL にアクセスしましょう。
