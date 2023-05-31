/* eslint-disable testing-library/no-unnecessary-act */
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Xumm } from 'xumm';

import { NftMinter } from '.';

jest.mock('nft.storage', () => {
  const { MockedNFTStorage } = require('../../__test__/__mock__/NFTStorage');
  return { NFTStorage: MockedNFTStorage };
});

jest.mock('xumm', () => {
  const { MockedXumm } = require('../../__test__/__mock__/Xumm');
  return { Xumm: MockedXumm };
});

jest.mock('xrpl-client', () => {
  const { XrplClient } = require('../../__test__/__mock__/XrplClient');
  return { XrplClient };
});

beforeEach(() => {
  jest.resetModules();
});

describe('not connected', () => {
  it('should exists connect button', () => {
    render(<NftMinter />);
    const btnElement = screen.getByRole('button', { name: /connect/i });
    expect(btnElement).toBeInTheDocument();
  });

  it('should call authorize when click connect button', () => {
    const authorize = jest.fn();
    const originalAuthorize = Xumm.prototype.authorize;
    Xumm.prototype.authorize = authorize;

    render(<NftMinter />);
    const btnElement = screen.getByText(/connect/i);
    act(() => {
      userEvent.click(btnElement);
    });
    expect(authorize).toBeCalled();
    Xumm.prototype.authorize = originalAuthorize;
  });

  it('should exists file input', () => {
    render(<NftMinter />);
    const btnElement = screen.getByText(/ファイルを選択/i);
    expect(btnElement).toBeInTheDocument();

    expect(
      within(btnElement).getByText(
        (_content, element) => element.tagName.toLowerCase() === 'input',
      ),
    ).toBeInTheDocument();
  });

  it('should exists img tag when select img', () => {
    window.URL.createObjectURL = jest.fn();
    const file = new File(['hello,xrpl'], 'test.png', { type: 'image/png' });
    render(<NftMinter />);
    const btnElement = screen.getByText(/ファイルを選択/i);
    const fileInputELement = within(btnElement).getByText(
      (_content, element) => element.tagName.toLowerCase() === 'input',
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    act(() => {
      userEvent.upload(fileInputELement, file);
    });
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should not exists mint button', () => {
    render(<NftMinter />);
    expect(screen.queryByText(/mint/i)).not.toBeInTheDocument();
  });
});

describe('connected', () => {
  it('should exists rAccount', async () => {
    render(<NftMinter />);
    const btnElement = screen.getByText(/connect/i);
    act(() => {
      userEvent.click(btnElement);
    });
    expect(await screen.findByText(/rAccount/i)).toBeInTheDocument();
  });

  it('should exists mint button', async () => {
    render(<NftMinter />);
    const btnElement = screen.getByText(/connect/i);
    act(() => {
      userEvent.click(btnElement);
    });
    expect(await screen.findByText(/mint/i)).toBeInTheDocument();
  });
});

it('should mint success', async () => {
  render(<NftMinter />);

  // connect
  const connectElement = screen.getByText(/connect/i);
  act(() => {
    userEvent.click(connectElement);
  });
  await screen.findByText(/rAccount/i);

  // select file
  const file = new File(['hello,xrpl'], 'test.png', { type: 'image/png' });
  const fileElement = screen.getByText(/ファイルを選択/i);
  const fileInputELement = within(fileElement).getByText(
    (_content, element) => element.tagName.toLowerCase() === 'input',
  );
  act(() => {
    userEvent.upload(fileInputELement, file);
  });

  // mint
  global.window.alert = jest.fn();
  global.window.open = jest.fn();
  const mintElement = await screen.findByText(/mint/i);
  act(() => {
    userEvent.click(mintElement);
  });

  await waitFor(() => {
    expect(global.window.open).toBeCalledWith(
      expect.stringContaining(
        '000A1EA4511569DD226DFBE9472AC240000FCA5F212289F4DE07D4DC0000008E',
      ),
      expect.anything(),
    );
  });
});
