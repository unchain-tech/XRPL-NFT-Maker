export class MockedNFTStorage {
  async store() {
    return { url: 'ipfs://abcd' };
  }
}
