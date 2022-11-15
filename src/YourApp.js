import React, { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MagicAuthConnector } from '@everipedia/wagmi-magic-connector';
import { useConnect, useAccount, useSignMessage, useDisconnect } from 'wagmi'

export const YourApp = () => {

  const { disconnectAsync } = useDisconnect()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const { connectAsync } = useConnect({
    connector: new MagicAuthConnector({
      options: {
        apiKey: process.env.REACT_APP_MAGIC_APIKEY
      },
    }),
  })

  const handleClick = async () => {
    if (isConnected) {
      await disconnectAsync()
    }
    const { account } = await connectAsync()
    console.log(account)
  };

  return(
    <div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <>
                        <button onClick={openConnectModal} type="button">
                          Connect Wallet
                        </button>
                        <button type="button" onClick={handleClick}>connect</button>
                      </>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} type="button">
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={openChainModal}
                        style={{ display: 'flex', alignItems: 'center' }}
                        type="button"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            } }
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button onClick={openAccountModal} type="button">
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </button>
                      <button>cust</button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
    </div>
  );
};